import { defineComponent, RenderFunction } from "vue";

// export const functionComponent = <Props, RawBindings extends Record<string, any> = Record<string, any>>(
//   setup: (props: Readonly<Props>, expose: (exposed?: RawBindings) => void) => RenderFunction
// ) =>
//   defineComponent<Props, RawBindings>({
//     inheritAttrs: false,
//     name: setup.name,
//     //  toRefs(attrs)
//     setup: (p, { attrs, expose }) => setup(attrs as any, expose),
//   });

/**
 * 生成随机id
 */
export function createRandomId() {
  return (
    "id-" +
    (Math.random() * 10000000).toString(16).substr(0, 4) +
    "-" +
    new Date().getTime() +
    "-" +
    Math.random().toString().substr(2, 5)
  );
}

/**
 * @description: 判断值是否为空,包括空[],{},'',不包括0
 * @param {any} str 所需判断的值
 * @return {Boolean} 是否为空
 */
export function isNull(str: any): boolean {
  if (str === undefined || str === null || str === "") {
    return true;
  } else if (Array.isArray(str) && str.length === 0) {
    return true;
  } else if (typeof str === "object" && Object.keys(str).length === 0) {
    return true;
  }
  return false;
}
/**
 * @description: 判断一个对象时候符合judge的条件。所有值相等是为true，任一值不相等返回false
 * @param {AnyObj} judge 条件
 * @param {AnyObj} data 数据
 * @return {Boolean}
 */
export function getJudge(judge: AnyObj, data: AnyObj): boolean {
  for (const key in judge) {
    if (data[key] !== judge[key]) {
      return false;
    }
  }
  return true;
}
/** 根据icon名，返回element的icon或者svg */
export const getIcon = (icon?: string, className?: string | string[]) =>
  icon?.includes("el-") ? (
    <i class={[icon, ...(Array.isArray(className) ? className : [className || ""])]} />
  ) : icon ? (
    <svg-icon icon-class={icon} class={className} />
  ) : null;
