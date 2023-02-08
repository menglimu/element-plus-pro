/**
 * @Author: wenlin
 * @Description: 表单的单项
 */

import {
  VNode,
  ref,
  resolveComponent,
  h,
  cloneVNode,
  mergeProps,
  VNodeChild,
  watch,
  computed,
  toRef,
  Ref,
  onMounted,
} from "vue";
import { isNull } from "@/utils";

import { getFormColumn } from "./config";
import { ElOption, FormItemInstance, formItemProps, FormItemProps } from "element-plus";
import { useOptions, UseOptionsProps } from "./utils";
import { BaseFormConfig, BaseFormProps } from "./form";

/** 表单的具体项配置 */
export interface BaseFormColumn<D = AnyObj>
  extends UseOptionsProps,
    UnReadonly<Omit<Partial<FormItemProps>, "required">> {
  /** 绑定的键名 */
  prop?: string;
  /** 表单项的vue组件唯一key名。默认使用prop || index，当prop重复是，需要传入该参数 */
  key?: string;

  /** 表单的类型，自定义的时候，传''或者不传 */
  type?: BaseFormType;
  /** 标签名，不填会从组件内匹配，自定义标签的时候，使用 */
  tag?: string;

  /** 默认值，初始化的时候，会有一次默认值计算，该项有值得时候，取该值。重置时也会重置到该值 */
  value?: unknown;

  disabled?: boolean | ((rootValue: D) => boolean);
  /** 输入框内的提示文本 */
  placeholder?: string;

  /** 输入项的子对象 */
  children?: () => VNodeChild;
  /** 自定义输入项的渲染 */
  render?: (value: unknown, onInput: (value?: unknown) => void, rootValue: AnyObj) => VNode;
  /** nodeData的props的代理 */
  props?: AnyObj;

  /** 是否展示，默认 true，可传方法，通过其他值或条件来控制 rootValue：根对象, */
  hide?: boolean | ((rootValue: D) => boolean);

  /** form-item的类名，自定义样式的时候可以使用 */
  className?: string;

  /**
   * 时候块级显示，独占一行，
   * @default false
   */
  block?: boolean;

  /**
   * 每个输入项的长度，默认 33.33%， block默认100%
   * @default 33.33%， block默认100%
   */
  itemBoxWidth?: string;
  /**
   * 输入项内容的长度，默认100%
   * @default 100%
   */
  itemWidth?: string;
  /**
   * 输入项内容的最大长度，默认100%
   * @default 100%
   */
  itemMaxWidth?: string;

  /** 最小长度 */
  minlength?: number;
  /** 最大长度 */
  maxlength?: number;
  /** 值的正则校验表达式 */
  reg?: string | RegExp;
  /** 是否必填 */
  required?: boolean | ((rootValue: D) => boolean);
}

/** 表单的类型 */
export type BaseFormType =
  | ""
  | "input"
  | "string"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "tree"
  | "upload"
  | "date"
  | "dates"
  | "daterange"
  | "time"
  | "timerange"
  | "datetime"
  | "datetimerange"
  | "color"
  | "cascader";

interface BaseFormItemProps {
  configItem: BaseFormColumn;
  rootValue: AnyObj;
  rootConfig: BaseFormConfig;
  cbInput: (prop?: string, val?: unknown) => void;
}
type BaseFormItemExpose = AnyObj & { relaodOptions: () => Promise<unknown> };
export default FC<BaseFormItemProps, BaseFormItemExpose>({
  name: "BaseFormItem",
  props: ["configItem", "rootValue", "rootConfig", "cbInput"],
  setup(props, { expose }) {
    const { configItem, rootValue, rootConfig, cbInput } = $(props);
    const elFormItem = ref<FormItemInstance>();
    const formItem = ref();

    const config = $computed(() => getFormColumn(configItem, rootConfig));
    const isHide = $computed(() => (typeof config.hide === "function" ? config.hide(rootValue || {}) : config.hide));
    // 提取出 elformItem 的一些props
    const elFormItemProps = $computed(() => {
      const objs: AnyObj = {};
      Object.keys(props.configItem)
        .filter((k) => k in formItemProps)
        .forEach((k) => {
          objs[k] = (props.configItem as any)[k];
        });
      return objs;
    });

    // 下拉，单选，多选等的选择项
    const { options, relaodOptions } = useOptions($$(config));
    const children = $computed(() => {
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
    });

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
        disabled:
          typeof config.disabled === "function" ? config.disabled(rootValue) : config.disabled ?? rootConfig.disabled,
        clearable: rootConfig.clearable,
        placeholder: config.placeholder,
        modelValue: rootValue[config.prop!],
        "onUpdate:modelValue": onInput,
        ref: formItem,
      };
      if (config.optionsGet) {
        baseProps.options = options.value;
      }

      // 绑定value和input事件
      let props = mergeProps(baseProps, config.props || {});

      // 有prop属性名和render同时存在的时候。render作为输入元素
      if (config.prop && config.render) {
        vnode = config.render(rootValue[config.prop!], onInput, rootValue);
      } else {
        const Tag = config.tag || "el-" + config.type;
        vnode = h(resolveComponent(Tag), config.children || children);
      }
      vnode = cloneVNode(vnode, props);
      return vnode;
    });

    onMounted(() => {
      formItem.value.relaodOptions = relaodOptions;
      expose(formItem.value);
    });

    function onInput(val: any) {
      // emitValue(val);
      cbInput(config.prop, val);
      elFormItem.value?.$emit("el.form.change");
    }

    return () => {
      if (isHide) return;
      // 按钮等其他元素的渲染。 无prop属性名
      if (config.render && !config.prop) {
        return config.render(rootValue[config.prop!], onInput, rootValue);
      }
      return (
        <el-form-item
          ref={elFormItem}
          class={{
            "ml-form-item": true,
            ["ml-form-" + config.type]: true,
            "ml-form-item-block": config.block,
            hide: isHide,
            // 'is-not-value': isNotValue
          }}
          style={{ width: config.itemWidth, maxWidth: config.itemMaxWidth }}
          {...elFormItemProps}
        >
          {vnode}
        </el-form-item>
      );
    };
  },
});
