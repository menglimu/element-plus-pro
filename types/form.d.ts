/*
 * @Author: wenlin
 * @Date: 2020-11-25 15:58:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-12-28 18:20:49
 * @Description: 表单相关定义
 */
import { UseOptionsProps } from "@/components/BaseForm/src/utils";
import { FormItemProps, FormItemRule } from "element-plus";
import { VNodeChild } from "vue";
import { VNode } from "vue";
// import { AnyObj, MlOptions, Partial } from "./common";

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
