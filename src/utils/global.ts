import { DefineComponent, defineComponent, RenderFunction } from "vue";

type FunctionComponent = <Props, RawBindings extends AnyObj = AnyObj>(
  setup: (props: Readonly<Props>, expose: (exposed?: RawBindings) => void) => RenderFunction
) => DefineComponent<Props, RawBindings>;
const functionComponent: FunctionComponent = (setup) =>
  defineComponent({
    inheritAttrs: false,
    name: setup.name,
    //  toRefs(attrs)
    setup: (p, { attrs, expose }) => setup(attrs as any, expose),
  }) as any;

window.functionComponent = functionComponent;

declare global {
  const functionComponent: FunctionComponent;
  interface Window {
    functionComponent: FunctionComponent;
  }
}
