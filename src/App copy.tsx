import BaseForm from "@/components/BaseForm";
import MlForm from "@/components/BaseForm";
import { ElInput } from "element-plus";
import { MlFormConfig } from "types/form";
import { BaseTableProps } from "types/table";
import { defineComponent, onMounted, ref, RenderFunction, SetupContext, toRefs, VNode } from "vue";
import BaseTable from "./components/BaseTable";
import Flow from "./components/Flow";
// import { debug } from "@vue/devtool/debug";
// const a: SetupContext
// import { $ref } from "vue/macros";

function declareComponent<Props, RawBindings extends Record<string, any>>(
  setup: (props: Readonly<Props>, expose: (exposed?: RawBindings) => void) => RenderFunction
) {
  return defineComponent<Props, RawBindings>({
    inheritAttrs: false,
    name: setup.name,
    //  toRefs(attrs)
    setup: (p, { attrs, expose }) => setup(attrs as any, expose),
  });
}

const AA = declareComponent<{ a: number; onInput: (a: number) => void }, { b: string }>(function A(props, expose) {
  const { a } = $(props);
  const bbb = ref(1);
  console.log(props.a);
  console.log(a);
  expose({ b: "1" });
  // debug({ a, bbb });
  return () => (
    <div onClick={() => props.onInput(a + 1)}>
      {a}123b{bbb.value}
    </div>
  );
});

export default defineComponent({
  data: () => ({ xx: 1 }),
  setup() {
    // const config: MlFormConfig = {
    //   columns: [
    //     { prop: "a", label: "aaa" },
    //     { prop: "b", label: "aaa" },
    //   ],
    // };
    let a = $ref(111234);
    const aaa = ref<any>({ a1: 222 });
    const { a1 } = aaa.value;
    const form = ref<InstanceType<typeof AA>>();
    console.log(form.value?.b);
    onMounted(() => console.log(form.value, 111));
    const config: BaseTableProps = {
      api: { list: () => Promise.resolve({ content: [{ name: "xxx" }], total: 2 }) },
      config: {
        data: [{ name: "xxx" }],
        columns: [
          { label: "姓名", prop: "name" },
          { label: "年龄", prop: "age" },
          { label: "编号", prop: "no" },
        ],
      },
    };
    return () => (
      <div>
        <BaseForm config={{ columns: [{ label: "啊啊啊", prop: "a" }] }} />
        <BB />
      </div>
      // <div onClick={() => aaa.value.a1++}>
      //   {/* <MlForm ref={form} config={config}></MlForm> */}
      //   {aaa.value.a1}
      //   <br />
      //   {a}
      //   aaa{aaa.value.b}
      //   {a1}
      //   <AA {...{ a: aaa.value.a, onInput: (a) => console.log(a) }} />
      //   <BaseTable {...config}></BaseTable>
      //   <ElInput>{{ prefix: () => <sapn>121231</sapn> }}</ElInput>
      //   <BB>
      //     {{
      //       default: () => (
      //         <span>
      //           123
      //           {console.log("slot")}
      //         </span>
      //       ),
      //     }}
      //   </BB>
      // </div>
    );
  },
});

const BB: any = defineComponent({
  props: {
    slota: null,
    a: null,
  },
  setup(props, { slots }) {
    const b = ref(1);
    return { b };
  },
  render() {
    return (
      <div>
        {this.a}
        {(this.$props as any).slota?.()}
        {this.$slots.default?.()}
      </div>
    );
  },
});
