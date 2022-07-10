/*
 * @Author: wenlin
 * @Date: 2020-11-25 15:58:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-12-28 18:20:49
 * @Description: 表单相关定义
 */
import { ElForm } from "element-ui/types/form";
import { VNode, CreateElement, VNodeData } from "vue/types/umd";
import { AnyObj, MlOptions, Partial } from "./common";

/** mlForm 对象定义 */
export class MlForm extends ElForm {
  /** 重置初始值 */
  public reset(): void;
  /** 重新刷新options name 为需要刷新的那项 key 或者 prop */
  public reloadOptions(name: string): void;
}

/** 表单的具体项配置 */
interface MlFormColumn<D = AnyObj> extends MlOptions {
  /** 表单项左侧提示的label名 */
  label?: string;

  /** 表单项的数据key名 */
  prop?: string;
  /** 表单项的vue组件唯一key名。默认使用prop || index，当prop重复是，需要传入该参数 */
  key?: string;

  /**
   * 表单的类型，自定义的时候，传''或者不传
   * @default string
   */
  type?: MlFormType;
  /**
   * 是否必填
   * @default false
   */
  required?: boolean;
  /** 默认值，初始化的时候，会有一次默认值计算，该项有值得时候，取该值。重置时也会重置到该值 */
  value?: any;
  /** 自定义输入项的渲染 */
  render?: (h: CreateElement, value: any, onInput: (value?: any) => void) => VNode | Element;
  /**
   * 其他扩展请参考element，nodeDate会通过渲染函数进行传值
   * @see https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
   */
  nodeData?: VNodeData;
  /** nodeData的attrs的代理 */
  attrs?: AnyObj;
  /** nodeData的props的代理 */
  props?: AnyObj;
  /**
   * 时候块级显示，独占一行，
   * @default false
   */
  block?: boolean;
  /** 输入框内的提示文本 */
  placeholder?: string;
  /**
   * label的长度
   * @default 100px
   */
  labelWidth?: string;
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
  /** 输入不符合时的提示 */
  error?: string;
  /** 最小长度 */
  minlength?: number;
  /** 最大长度 */
  maxlength?: number;
  /** 值的正则校验表达式 */
  reg?: string | RegExp;
  /**
   * 输入值的校验规则，详细可以参考element
   * @see https://element.eleme.cn/#/zh-CN/component/form
   */
  rules?: Array<MlFormRule>;
  /** 是否展示，默认 true，可传方法，通过其他值或条件来控制 rootValue：根对象, */
  show?: boolean | ((rootValue: D) => boolean);
  /** form-item的类名，自定义样式的时候可以使用 */
  className?: string;
  /**
   * uiType为round的时候。控制时候显示round
   * @default true
   */
  hideRound?: boolean;
  /** 对输入的值进行格式化 */
  format?: {
    /** 自己的值格式化为组件的正常值 */
    toEleValue?: (value: any, rootValue: D) => any;
    /** 组件的值转为自己的格式 */
    toValue?: (value: any, rootValue: D) => any;
  };
  /** 标签名，不填会从组件内匹配，自定义标签的时候，使用 */
  tag?: string;
  /** 输入项的子对象 */
  children?: VNode | Element | ((h: CreateElement) => VNode | Element);
}

/** 表单的配置项,D为输出的data对象的类型 */
export interface MlFormConfig<D = AnyObj> {
  /** 具体表单项的配置 */
  columns: Array<MlFormColumn<D>>;

  /** 表单的基础样式，line为下划线，round为圆角, border为边框
   * @default line
   */
  uiType?: "line" | "round" | "border";

  /** label的长度
   * @default 100px
   */
  labelWidth?: string;

  /** label的对齐方式
   * @default 下划线默认左对齐，圆角默认居中
   */
  labelPosition?: "left" | "right" | "center" | "top";

  /** 每个输入项的长度，
   * @default  33.33%, block 默认100%
   */
  itemBoxWidth?: string; // 输入项宽度

  /** 输入项内容的长度
   * @default 100%
   */
  itemWidth?: string;

  /** 输入项内容的最大长度
   * @default 100%
   */
  itemMaxWidth?: string;

  /** 是否行内表单
   * @default true
   */
  inline?: boolean;

  /** 是否显示清除按钮
   * @default true
   */
  clearable?: boolean;

  /** 元素的size，默认40高，medium为36px，small为32px，mini为28px */
  size?: "large" | "medium" | "small" | "mini";

  /** 自适应表单大小
   * @default false
   */
  autoSize?: boolean;

  /** 数据格式化函数 */
  format?: {
    /** 自己的值格式化为组件的正常值 */
    toEleValue?: (value: any) => D;
    /** 组件的值转为自己的格式 */
    toValue?: (value: D) => any;
  };

  /**
   * form的整体校验规则，参考官方文档
   * @see https://element.eleme.cn/#/zh-CN/component/form
   */
  rules?: AnyObj;

  /** 是否禁用
   * @default false
   */
  disabled?: boolean;

  /** 表单域标签的后缀 */
  labelSuffix?: string;

  /**
   * 是否显示校验错误信息
   * @default true
   */
  showMessage?: boolean;

  /**
   * 是否以行内形式展示校验信息
   * @default false
   */
  inlineMessage?: boolean;

  /**
   * 是否在输入框中显示校验结果反馈图标
   * @default false
   */
  statusIcon?: boolean;

  /**
   * 是否在 rules 属性改变后立即触发一次验证
   * @default true
   */
  validateOnRuleChange?: boolean;
}

/** mlForm的prop对象集合 */
export interface MlFormProp<D = AnyObj> {
  config: MlFormConfig<D>;
  value: D;
}

/** 表单的类型 */
type MlFormType =
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

/** 具体可参考element中的form的校验 */
interface MlFormRule {
  message?: string;
  trigger?: "blur" | "change";
  pattern?: RegExp;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
  validator?: (rule: any, value: any, callback: (error?: Error) => void) => void;
  asyncValidator?: (rule: any, value: any, callback: (error?: Error) => void) => void;
  // validator(value:any, rootValue?:any): boolean
}

// 预制组件配置
interface ComponentsPreset {
  [key: string]: {
    tag?: string;
    nodeData?: VNodeData;
    children?: VNode[] | Element[] | ((h: CreateElement) => VNode[] | Element[]);
  };
}

/** use的时候使用的一些默认配置项 */
interface MlFormDefaultOptions {
  framework?: "cui" | "element-ui";
  componentsPreset?: ComponentsPreset;
  configDefault?: Partial<MlFormConfig>;
}
