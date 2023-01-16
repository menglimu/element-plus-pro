/**
 * @Author: wenlin
 * @Description: 表单的单项
 */

import {
  VNode,
  watchEffect,
  ref,
  resolveComponent,
  h,
  cloneVNode,
  mergeProps,
  reactive,
  isProxy,
  isRef,
  shallowReactive,
  VNodeChild,
} from "vue";
import { isNull } from "@/utils";

import { getFormColumn } from "./config";
import { FormItemInstance, formItemProps, FormItemProps } from "element-plus";
import { useModel, UseModelEmits, UseModelProps, useOptions, UseOptionsProps } from "./utils";
import { BaseFormConfig, BaseFormProps } from "./form";

/** 表单的具体项配置 */
export interface BaseFormColumn<D = AnyObj> extends UseOptionsProps, FormItemProps {
  prop?: string;
  /** 表单的类型，自定义的时候，传''或者不传 */
  type?: BaseFormType;

  /** 默认值，初始化的时候，会有一次默认值计算，该项有值得时候，取该值。重置时也会重置到该值 */
  value?: unknown;

  /** 输入框内的提示文本 */
  placeholder?: string;

  /** 表单项的vue组件唯一key名。默认使用prop || index，当prop重复是，需要传入该参数 */
  key?: string;

  /** 输入项的子对象 */
  children?: () => VNodeChild;

  /** 自定义输入项的渲染 */
  render?: (value: unknown, onInput: (value?: unknown) => void) => VNode;

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

  /** 标签名，不填会从组件内匹配，自定义标签的时候，使用 */
  tag?: string;
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

interface BaseFormItemProps extends UseModelProps {
  configItem: BaseFormColumn;
  rootValue?: AnyObj;
  rootConfig: BaseFormConfig;
}
type BaseFormItemEmits = UseModelEmits<AnyObj>;

export default FC<
  BaseFormItemProps,
  BaseFormItemEmits,
  { xxxx: () => void; aaa: (a: number) => void; input: (a: number) => void }
>({
  name: "FormItem",
  props: ["configItem", "rootValue", "rootConfig", "value"],

  setup(props, { emit }) {
    const { configItem, rootValue, rootConfig } = $(props);

    const elFormItem = ref<FormItemInstance>();

    let config_ = $computed(() => getFormColumn(configItem, rootConfig));
    console.log(isProxy(config_));

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
    const options = useOptions({ options: [] });
    const { value, emitValue } = useModel(props, emit);

    const isHide = $computed(() => (typeof config_.hide === "function" ? config_.hide(rootValue || {}) : config_.hide));

    function onInput(val: any) {
      emitValue(val);

      elFormItem.value?.$emit("el.form.change");
    }

    function renderChildren() {
      if (typeof config_.children === "function") {
        return config_.children();
      }
      const options_ = isNull(options) ? config_.options : options;
      if (["radio", "checkbox", "select"].includes(config_.type!) && Array.isArray(options)) {
        // 下拉列表时，渲染下拉项
        if (config_.type === "select") {
          return options.map((option, index) => (
            <el-option {...{ props: option }} key={index} label={option["label"]} value={option["value"]}></el-option>
          ));
        } else if (config_.type === "radio") {
          // 单选框、多选框
          return options.map((option, index) => (
            <el-radio {...{ ...option, label: option["value"] }} key={index}>
              {option["label"]}
            </el-radio>
          ));
        } else if (config_.type === "checkbox") {
          // 单选框、多选框
          return options.map((option, index) => (
            <el-checkbox {...{ ...option, label: option["value"] }} key={index}>
              {option["label"]}
            </el-checkbox>
          ));
        }
      }
      return [];
    }

    return () => {
      if (isHide) {
        return;
      }
      // 按钮等其他元素的渲染。 无prop属性名
      if (config_.render && !config_.prop) {
        let vnode = config_.render(value, onInput);
        return vnode;
      }

      // 渲染vnode
      let vnode: VNode | Element;
      // 将base基础的属性放入公共对象。因为子组件可能没有定义prop而直接取attr的时候。先将这些属性同时复制到attr和prop
      let baseProps: AnyObj = {
        size: rootConfig.size,
        disabled: rootConfig.disabled,
        clearable: rootConfig.clearable,
        placeholder: config_.placeholder,
        modelValue: value,
        "onUpdate:modelValue": onInput,
      };
      if (config_.optionsGet) {
        baseProps.options = options;
      }

      // 绑定value和input事件
      let props = mergeProps(baseProps);

      // 有prop属性名和render同时存在的时候。render作为输入元素
      if (config_.prop && config_.render) {
        vnode = config_.render(value, onInput);
      } else {
        const Tag = config_.tag || "el-" + config_.type;
        vnode = h(resolveComponent(Tag), renderChildren);
      }
      vnode = cloneVNode(vnode, props);
      console.log(elFormItemProps);

      return (
        <el-form-item
          ref={elFormItem}
          class={{
            "ml-form-item": true,
            ["ml-form-" + config_.type]: true,
            "ml-form-item-block": config_.block,
            hide: isHide,
            // 'is-not-value': isNotValue
          }}
          style={{ width: config_.itemWidth, maxWidth: config_.itemMaxWidth }}
          {...elFormItemProps}
        >
          {vnode}
        </el-form-item>
      );
    };
  },
});
