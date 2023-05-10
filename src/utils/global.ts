import { UseModelEmits, UseModelProps, useModel } from "@/components/BaseForm/hooks/useModel";
import { BaseFormConfig, BaseFormProps } from "@/components/BaseForm/src/Form";
import { Component, DefineComponent, defineComponent, Directive, EmitsOptions, Ref, RenderFunction, SetupContext, UnwrapNestedRefs } from "vue";

type UnionToIntersection<U> = (U extends any ? (a: (k: U) => void) => void : never) extends (a: infer I) => void ? I : never;
type UnionLast<U> = UnionToIntersection<U> extends (a: infer I) => void ? I : never;
type UnionToTuple<U> = [U] extends [never] ? [] : [...UnionToTuple<Exclude<U, UnionLast<U>>>, UnionLast<U>];

// type EmitFn<Options = Record<string, any>, Event extends keyof Options = keyof Options> = Options extends Array<infer V>
//   ? (event: V, ...args: any[]) => void
//   : {} extends Options
//   ? (event: string, ...args: any[]) => void
//   : UnionToIntersection<
//       {
//         [key in Event]: Options[key] extends (...args: infer Args) => any
//           ? (event: key, ...args: Args) => void
//           : (event: key, ...args: any[]) => void;
//       }[Event]
//     >;

interface SetupCtx<RawBindings, Emits> {
  attrs: SetupContext["attrs"];
  slots: SetupContext["slots"];
  emit: SetupContext<Emits>["emit"];
  expose: (exposed: RawBindings) => void;
}

interface ComponentOptionsBase<Props, RawBindings, Emits> {
  name?: string;
  inheritAttrs?: boolean;
  props?: UnionToTuple<keyof Props> | (keyof Props)[];
  emits?: UnionToTuple<keyof Emits> | (keyof Emits)[];
  setup: (props: Readonly<Props>, ctx: SetupCtx<RawBindings, Emits>) => Promise<RawBindings> | RawBindings | RenderFunction | void;
  components?: Record<string, Component>;
  directives?: Record<string, Directive>;
  serverPrefetch?(): Promise<any>;
}
type FunctionComponent = <Props extends AnyObj = {}, RawBindings extends AnyObj = {}, Emits extends EmitsOptions = {}>(
  options: ComponentOptionsBase<Props, RawBindings, Emits>
) => DefineComponent<Props, UnwrapNestedRefs<RawBindings>, {}, {}, {}, {}, {}, Emits>;

const functionComponent = (options: any) => defineComponent(options) as any;

export interface FormFcProps<V = unknown> extends UseModelProps<V> {
  size?: BaseFormConfig["size"];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  readonly?: boolean;
}
interface ComponentOptionsForm<V, Props, RawBindings, Emits> extends Omit<ComponentOptionsBase<Props, RawBindings, Emits>, "setup"> {
  setup: (
    props: Readonly<Props>,
    ctx: SetupCtx<RawBindings, Emits>,
    model: {
      emitValue: (val: V) => void;
      value: Ref<V>;
    }
  ) => Promise<RawBindings> | RawBindings | RenderFunction | void;
}
type FormFunctionComponent = <V = unknown, Props extends AnyObj = {}, RawBindings extends AnyObj = {}, Emits extends EmitsOptions = {}>(
  options: ComponentOptionsForm<V, Props & FormFcProps<V>, RawBindings, Emits & UseModelEmits<V>>
) => DefineComponent<Props & FormFcProps<V>, UnwrapNestedRefs<RawBindings>, {}, {}, {}, {}, {}, Emits>;

const formFunctionComponent = (options: any) => {
  const propsF = ["size", "placeholder", "disabled", "clearable", "readonly", "modelValue"];
  const { props, setup, ...others } = options;
  return defineComponent({
    ...others,
    props: [...propsF, ...(props || [])],
    setup(props: any, ctx: any) {
      return setup(props, ctx, useModel(props, ctx.emit));
    },
  }) as any;
};

window.FC = functionComponent;
window.FromFC = formFunctionComponent;
declare global {
  const FC: FunctionComponent;
  const FromFC: FormFunctionComponent;
  interface Window {
    FC: FunctionComponent;
    FromFC: FormFunctionComponent;
  }
}

// defineComponent({
//   props: ["A", "b"],
//   methods: {},
// });

// type FunctionComponent = <Props, RawBindings extends AnyObj = AnyObj>(
//   setup: (props: Readonly<Props>, expose: (exposed?: RawBindings) => void) => RenderFunction
// ) => DefineComponent<UnionToTuple<keyof Props>, RawBindings>;

// const functionComponent: FunctionComponent = (setup) =>
//   defineComponent({
//     inheritAttrs: false,
//     name: setup.name,
//     //  toRefs(attrs)
//     setup: (p, { attrs, expose }) => setup(attrs as any, expose),
//   }) as any;

// window.functionComponent = functionComponent;

// declare global {
//   const functionComponent: FunctionComponent;
//   interface Window {
//     functionComponent: FunctionComponent;
//   }
// }
