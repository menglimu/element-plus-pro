// import { ElButton } from "element-plus";
import { ElButton } from "element-plus";
import { BaseTableProps } from "types/table";
import { computed, defineComponent, reactive, ref, watch, watchEffect } from "vue";
import BaseForm from "./components/BaseForm";
import { BaseFormConfig, BaseFormProps } from "./components/BaseForm/src/form";
import BaseFormDemo from "@/components/BaseForm/demo";
export interface AAA {
  disabled: boolean;
}

const BB = defineComponent(function BB(props: { name: string }) {
  console.log(1235);

  return <div>111{props.name}</div>;
});

const CC = FC<{ a: string; b: AnyObj }>({
  props: ["a", "b"],
  setup(props, { attrs }) {
    const { a, b } = $(props);
    console.log(props.a, props, attrs);
    const name = a;

    watch(
      () => a,
      () => {
        console.log("aaaaa");
      }
    );
    watch(
      () => b,
      () => {
        console.log("bbb");
      }
    );
    return () => <div>{name}</div>;
  },
});

export default FC({
  setup() {
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
    let name = $ref("xx");
    let data = reactive({ a: 1, b: [], c: { a: 1 } });
    let xxx = ref({ a: 1 });
    const data_ = computed(() => ({ ...data }));
    watch(
      () => xxx.value.a,
      () => {
        console.log(1234567);
      }
      // { deep: true }
    );
    const cc = data.c;
    watch(
      () => cc.a,
      () => {
        console.log(12345678);
        console.log("a is changed");
      },
      { deep: true }
    );
    // watchEffect(() => {
    //   for (let index = 0; index < data.b.length; index++) {
    //     name = data.b[index];
    //   }
    //   // name = data.b;
    //   console.log(data, "a is changed");
    // });
    return () => (
      <div>
        XXX11
        <CC a={name} b={data}></CC>
        {/* <BB name={name} /> */}
        {/* <ElButton icon={""}>22</ElButton>
        <el-button icon>xxx</el-button> */}
        <BaseFormDemo />
      </div>
    );
  },
});
