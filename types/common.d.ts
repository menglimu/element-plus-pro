/**
 * 基cui进行二次开发
 * 提供form、table组件
 */

/*
 * @Author: wenlin
 * @Date: 2020-06-01 09:27:44
 * @LastEditors: wenlin
 * @LastEditTime: 2020-12-28 15:21:20
 * @Description:  配置的定义
 */

export interface MlOptions<O = AnyObj> {
  /** 下拉，单选多选等数据的选项 */
  options?: Array<O>;

  /** 异步获取的数据选项函数 */
  optionsGet?: () => Promise<{ content: O[] } | O[]>;

  /** 下拉显示的名字key 默认label
   * @default label
   */
  optionLabel?: string;

  /** 下拉取值得key 默认value
   * @default value
   */
  optionValue?: string;

  /** 树形的children取值 默认children
   * @default children
   */
  optionChildren?: string;
}

/** 任意json对象 */
export interface AnyObj {
  [key: string]: any;
}

/** 转发所有属性为可选 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// export default {
//   MlForm,
//   install(vue: typeof Vue, options?: AnyObj): void;
// };
