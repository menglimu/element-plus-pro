// import { ElButton } from "element-plus";
import { ElButton } from "element-plus";
import { BaseTableProps } from "types/table";
import { computed, defineComponent, reactive, ref, watch, watchEffect } from "vue";
import BaseForm from "./components/BaseForm";
import { BaseFormConfig, BaseFormProps } from "./components/BaseForm/src/form";
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
    let val = $ref({ a: 1, b: [] });
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
    let formConfig: BaseFormConfig = $ref({
      disabled: false,
      columns: [
        { label: "啊啊啊", prop: "a" },
        { label: "选择", prop: "select", type: "select", options: [] },
      ],
    });
    function cbOption() {
      // const a = Object.assign({ a: 1 }, { b: "1" });
      // // const b:typeof a.a=
      // // val = reactive({ a: 1 });
      // // data.a = 2;
      // data.b.push(12);
      // xxx.value.a = 123;
      // xxx.value = { a: 123 };
      data.c = { a: 3 };
      // // xxx.value.b = 234;
      // data = reactive({ b: [1234] });
      // data.b = [];
      // console.log(data.a);
      // name = "1111";
      // data.a = 2;
      // Object.assign(data, { b: [1234] });
      // data.b.push(12);
      // formConfig.disabled = true;
      // formConfig.columns[1] = { label: "选择1", prop: "select", type: "select", options: [{ label: "1", value: "1" }] };
      formConfig.columns[1].options?.push({ label: "1", value: "1" });
      if (formConfig) {
        formConfig.columns.push({
          label: "选择2",
          prop: "select1111",
          type: "select",
          options: [{ label: "1", value: "1" }],
        });
      } else {
        formConfig = {
          disabled: false,
          columns: [
            { label: "啊啊啊", prop: "a" },
            { label: "选择", prop: "select", type: "select", options: [] },
          ],
        };
      }
    }
    return () => (
      <div>
        XXX11
        <CC a={name} b={data}></CC>
        <BaseForm config={formConfig} v-model={val} />
        {JSON.stringify(val)}
        {/* <BB name={name} /> */}
        {/* <ElButton icon={""}>22</ElButton>
        <el-button icon>xxx</el-button> */}
        <ElButton onClick={cbOption}>改变options</ElButton>
      </div>
    );
  },
});
