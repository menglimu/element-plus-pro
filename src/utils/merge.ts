/*
 * @Author: wenlin
 * @Date: 2020-12-23 14:53:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-12-28 17:46:59
 * @Description: 调用 lodash 的 merge 并自定义合并function的逻辑
 */

import { mergeWith, cloneDeep } from "lodash";
import { isNull } from "./index";

let customMerge = (a: any, b: any) => {
  if (Array.isArray(a) && Array.isArray(b)) return cloneDeep(b);
  if (typeof a === "function" && typeof b === "function") {
    return function (...arg) {
      a(...arg);
      return b(...arg);
    };
  }
};

function merge<TSource1 extends Object, TSource2 extends Object>(
  source1: TSource1,
  source2: TSource2,
): TSource1 & TSource2;
function merge<TSource1 extends Object, TSource2 extends Object, TSource3 extends Object>(
  source1: TSource1,
  source2: TSource2,
  source3: TSource3,
): TSource1 & TSource2 & TSource3;
function merge<TSource1 extends Object, TSource2 extends Object, TSource3 extends Object, TSource4 extends Object>(
  source1: TSource1,
  source2: TSource2,
  source3: TSource3,
  source4: TSource4,
): TSource1 & TSource2 & TSource3 & TSource3;
function merge<T = any>(...options: any[]): T;
/**
 * 合并多个对象，后面会覆盖前面的(undefined不会覆盖，需要置空前对象的值时，使用null)。2个function会合并执行。
 * @param base 基础类型，返回的类型。默认为该类型，可通过指定泛型
 * @param options 要merge的东西，可以多个
 * @returns T
 */
function merge(...args: any[]) {
  let options = args.filter((item) => Object.prototype.toString.call(item) === "[object Object]");
  // 数组的合并方式
  if (options.length > 0) {
    return mergeWith({}, ...options, customMerge);
  }
  if (args.length === 1) {
    return args[0];
  }
  if (args.length > 1) {
    let [obj, source] = args;
    return mergeWith(obj, ...source, customMerge);
  }
  // if (options.length === 1) {
  //   return cloneDeep(options[0]);
  // } else if (options.length > 1) {
  //   let [obj, source] = options;
  //   return mergeWith(obj, ...source, customMerge);
  // }
}

export default merge;
