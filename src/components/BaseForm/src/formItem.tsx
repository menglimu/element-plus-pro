/**
 * @Author: wenlin
 * @Description: 表单的单项
 */

import { VNode, ref, resolveComponent, h, cloneVNode, mergeProps, VNodeChild, inject, Ref, provide, isReactive, isRef } from "vue";
import { getFormColumn, getPrefix, getTrigger, getValByType } from "./utils";
import { FormItemInstance, formItemProps, FormItemProps, FormItemRule } from "element-plus";
import { useOptions, UseOptionsProps } from "../hooks/useOptions";
import { emitFormValueKey, emitFormInitValueKey, formConfigKey, formValueKey } from "../keys";
import { BaseFormType } from "./utils";

/** 表单的具体项配置 */
export interface BaseFormColumn<D = AnyObj> extends UseOptionsProps, UnReadonly<Omit<Partial<FormItemProps>, "required">> {
  /** 绑定的键名 不能重复 */
  prop?: string;

  /** 表单的类型，自定义的时候，传''或者不传 */
  type?: BaseFormType;
  /** 标签名，不填会从组件内匹配，自定义标签的时候，使用 */
  tag?: string;

  /** 默认值，初始化的时候，会有一次默认值计算，该项有值得时候，取该值。重置时也会重置到该值 */
  value?: unknown;
  /** 输入框内的提示文本 */
  placeholder?: string;

  /** 输入项的子对象 */
  children?: () => VNodeChild;
  /** 自定义输入项的渲染 */
  render?: (value: unknown, onInput: (value?: unknown) => void, rootValue: AnyObj) => VNode;
  /** nodeData的props的代理 */
  props?: AnyObj;

  /** form-item的类名，自定义样式的时候可以使用 */
  className?: string;
  /** inlineform的时候块级显示，独占一行 */
  block?: boolean;
  /** formitem 的宽度 */
  width?: string;

  /** 值的正则校验表达式 */
  reg?: string | RegExp;

  /** 是否展示，默认 true，可传方法，通过其他值或条件来控制 rootValue：根对象, */
  hide?: boolean | ((rootValue: D) => boolean);
  /** 是否必填 */
  required?: boolean | ((rootValue: D) => boolean);
  /** 是否禁用 */
  disabled?: boolean | ((rootValue: D) => boolean);
}

interface BaseFormItemProps {
  configItem: BaseFormColumn;
}
export type BaseFormItemExpose = { relaodOptions: () => Promise<unknown> };
export default FC<BaseFormItemProps, BaseFormItemExpose>({
  name: "BaseFormItem",
  props: ["configItem"],
  setup(props, { expose }) {
    const { configItem } = $(props);

    const { rootConfig, rootValue } = $({ rootValue: inject(formValueKey)!, rootConfig: inject(formConfigKey)! });
    const onInput = inject(emitFormValueKey);
    const emitInitValue = inject(emitFormInitValueKey);

    const elFormItem = ref<FormItemInstance>();

    const config = $computed(() => getFormColumn(configItem));
    const rules = $computed(() => {
      let rule: FormItemRule[] = [];
      if (config.required !== undefined) {
        const prefix = getPrefix(config.type);
        const trigger = getTrigger(prefix);
        rule.push({
          required: typeof config.required === "function" ? config.required(rootValue || {}) : config.required,
          message: `请${prefix}${config.label}`,
          trigger: trigger,
        });
      }
      return config.rules ? rule.concat(config.rules) : rule;
    });
    const isHide = $computed(() => (typeof config.hide === "function" ? config.hide(rootValue || {}) : config.hide));
    // 提取出 elformItem 的一些props
    const elFormItemProps = $computed(() => {
      const objs: AnyObj = {};
      Object.keys(config)
        .filter((k) => k in formItemProps)
        .forEach((k) => {
          // rules和required 特殊处理，在上面计算
          if (["rules", "required"].includes(k)) return;
          objs[k] = (config as any)[k];
        });
      return objs;
    });
    // 将当前初始值提交给form表单
    const defaultValue = getValByType(config);
    defaultValue !== undefined && emitInitValue?.(defaultValue, config.prop);

    // 下拉，单选，多选等的选择项
    const { options, relaodOptions } = useOptions($$(config));
    const renderChildren = () => children(config, options);

    // 渲染vnode
    const vnode = $computed(() => {
      // 不需要渲染的时候，直接不进行下面的操作
      if ((config.render && !config.prop) || isHide) {
        return;
      }
      let vnode: VNode;
      // 将base基础的属性放入公共对象。因为子组件可能没有定义prop而直接取attr的时候。先将这些属性同时复制到attr和prop
      let baseProps: AnyObj = {
        size: rootConfig.size,
        disabled: typeof config.disabled === "function" ? config.disabled(rootValue) : config.disabled ?? rootConfig.disabled,
        clearable: rootConfig.clearable,
        placeholder: config.placeholder,
        modelValue: rootValue[config.prop!],
        "onUpdate:modelValue": onElInput,
      };
      if (config.optionsGet) {
        baseProps.options = options.value;
      }

      // 绑定value和input事件
      let props = mergeProps(baseProps, config.props || {});

      //因为reactive会深层次处理内部的ref使用function来为ref赋值
      if (configItem.props && "ref" in configItem.props) {
        if (typeof configItem.props.ref !== "function") {
          props.ref = (el: unknown) => {
            if (isRef(configItem.props!.ref) && !isReactive(configItem.props)) {
              configItem.props!.ref.value = el;
            } else {
              configItem.props!.ref = el;
            }
          };
        }
      }

      // 有prop属性名和render同时存在的时候。render作为输入元素
      if (config.prop && config.render) {
        vnode = config.render(rootValue[config.prop!], onElInput, rootValue);
      } else {
        const Tag = config.tag || "el-" + config.type;
        vnode = h(resolveComponent(Tag), config.children || renderChildren);
      }

      return cloneVNode(vnode, props, true);
    });

    // reloadOptions 使用场景不多 先注释掉
    // onMounted(() => {
    //   expose({ relaodOptions });
    // });

    function onElInput(val: unknown) {
      // emitValue(val);
      onInput?.(val, config.prop);
      elFormItem.value?.$emit("el.form.change");
    }

    return () => {
      if (isHide) return;
      // 按钮等其他元素的渲染。 无prop属性名
      if (config.render && !config.prop) {
        return config.render(rootValue[config.prop!], onElInput, rootValue);
      }
      return (
        <el-form-item
          v-show={!isHide}
          ref={elFormItem}
          style={{ width: config.width || rootConfig.width }}
          class={[
            config.className,
            "ml-form-item",
            "ml-form-" + config.type,
            {
              "base-form-item-block": config.block,
            },
          ]}
          {...elFormItemProps}
          rules={rules}
        >
          {vnode}
        </el-form-item>
      );
    };
  },
});

// { label: string; value: string }
function children(config: BaseFormColumn, options: Ref<AnyObj[]>) {
  if (["radio", "checkbox", "select"].includes(config.type!) && Array.isArray(options.value)) {
    // 下拉列表时，渲染下拉项
    if (config.type === "select") {
      return options.value.map((option, index) => (
        <el-option {...{ props: option }} key={index} label={option["label"]} value={option["value"]}></el-option>
      ));
    } else if (config.type === "radio") {
      // 单选框、多选框
      return options.value.map((option, index) => (
        <el-radio {...{ ...option, label: option["value"] }} key={index}>
          {option["label"]}
        </el-radio>
      ));
    } else if (config.type === "checkbox") {
      // 单选框、多选框
      return options.value.map((option, index) => (
        <el-checkbox {...{ ...option, label: option["value"] }} key={index}>
          {option["label"]}
        </el-checkbox>
      ));
    }
  }
}
