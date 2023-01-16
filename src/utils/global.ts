import {
  Component,
  DefineComponent,
  defineComponent,
  Directive,
  EmitsOptions,
  RenderFunction,
  SetupContext,
} from "vue";

type UnionToIntersection<U> = (U extends any ? (a: (k: U) => void) => void : never) extends (a: infer I) => void
  ? I
  : never;
type UnionLast<U> = UnionToIntersection<U> extends (a: infer I) => void ? I : never;
type UnionToTuple<U> = [U] extends [never] ? [] : [...UnionToTuple<Exclude<U, UnionLast<U>>>, UnionLast<U>];

type EmitFn<Options = Record<string, any>, Event extends keyof Options = keyof Options> = Options extends Array<infer V>
  ? (event: V, ...args: any[]) => void
  : {} extends Options
  ? (event: string, ...args: any[]) => void
  : UnionToIntersection<
      {
        [key in Event]: Options[key] extends (...args: infer Args) => any
          ? (event: key, ...args: Args) => void
          : (event: key, ...args: any[]) => void;
      }[Event]
    >;

interface SetupCtx<RawBindings, Emits> {
  attrs: SetupContext["attrs"];
  slots: SetupContext["slots"];
  emit: SetupContext<Emits>["emit"];
  expose: (exposed: RawBindings) => void;
}

interface ComponentOptionsBase<Props, Emits, RawBindings> {
  name?: string;
  inheritAttrs?: boolean;
  props?: UnionToTuple<keyof Props> | (keyof Props)[];
  emits?: UnionToTuple<keyof Emits> | (keyof Emits)[];
  setup: (
    props: Readonly<Props>,
    ctx: SetupCtx<RawBindings, Emits>
  ) => Promise<RawBindings> | RawBindings | RenderFunction | void;
  components?: Record<string, Component>;
  directives?: Record<string, Directive>;
  serverPrefetch?(): Promise<any>;
}
type FunctionComponent = <Props extends AnyObj = {}, Emits extends EmitsOptions = {}, RawBindings extends AnyObj = {}>(
  options: ComponentOptionsBase<Props, Emits, RawBindings>
) => DefineComponent<Props, RawBindings, {}, {}, {}, {}, {}, Emits>;

const functionComponent: FunctionComponent = (options: any) => defineComponent(options) as any;

window.FC = functionComponent;

declare global {
  const FC: FunctionComponent;
  interface Window {
    FC: FunctionComponent;
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
