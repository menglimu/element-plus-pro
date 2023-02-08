/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
interface AnyObj {
  [key: string]: any;
}

/** 获取数组中的每一项对应的类型 */
type InferArray<T> = T extends (infer U)[] ? U : never;

/** 去掉readonly */
type UnReadonly<T> = {
  -readonly [P in keyof T]: T[P];
};
