import BaseTable from "..";
import { reactive, ref } from "vue";
import { ElButton } from "element-plus";
import { BaseTableExpose, BaseTableProps } from "../src";

/**
 * @Author: wenlin
 * @Description: 表格使用demo
 */
interface IProps {}
export default FC<IProps>({
  name: "BaseTableDemo",
  props: [],
  setup(props) {
    const tableProps: BaseTableProps = reactive({
      title: "西山查询",
      fullHeight: true,

      searchProps: {
        modelValue: { xx: "1356" },
        config: {
          // labelPosition: "left",
          columns: [
            { label: "sdg啥得更快了上接", prop: "xx", required: true },
            { label: "111", prop: "xx1" },
            { label: "111", prop: "xx2" },
            { label: "111", prop: "xx3" },
            { label: "111", prop: "xx4" },
            { label: "111", prop: "xx5" },
            { label: "111", prop: "xx6" },
            { label: "111", prop: "xx7" },
            { label: "111", prop: "xx8" },
            { label: "111", prop: "xx9" },
          ],
        },
      },
      api: {
        list(data) {
          console.log(data);
          return new Promise((resolve) => {
            setTimeout(() => resolve({ total: 30, content: [{ aa: 1, cc: { a: 16 }, aaa: 1123 }] }), 3000);
          });
          return Promise.resolve({ total: 3, content: [{ aa: 1, cc: { a: 16 }, aaa: 1123 }] });
        },
      },
      config: {
        innerBtn: [
          { name: "1aa" },
          { name: "1aa" },
          {
            render(scoped) {
              console.log(scoped, "scoped");
              return 1;
            },
          },
        ],
        columns: [
          { label: "a", prop: "aa" },
          { label: "c", prop: "cc.a" },
          { label: "a", prop: "aaa", type: "select" },
        ],
      },
      outerBtn: [
        { name: "axxg", type: "danger", hideJudge: (rows) => rows.length === 1 },
        { name: "axxg", hideJudge: (rows) => rows.length === 1 },
        { name: "axxg", plain: false, hideJudge: (rows) => rows.length === 1 },
        { render: (rows: AnyObj) => rows.length },
      ],
      // paginationProps: {
      //   pageSize: 20,
      //   layout: "total, sizes",
      // },
    });
    const baseTable = ref<InstanceType<typeof BaseTable>>();
    console.log(reactive({ aa: ref(0), bb: 1 }), { aa: ref(0), bb: 1 });
    const a = ref(1);
    const aa = ref({ a: a });
    // aa.value = { a: a };
    console.log(aa.value.a);
    a.value = 2;
    console.log(aa.value.a);

    function onClick() {
      // tableProps.paginationProps.pageSize = 30;
      // tableProps.paginationProps.layout = "total";
      // tableProps.searchProps.modelValue.xx = 11123;
      console.log(baseTable.value?.selection, baseTable);
      baseTable.value?.tableSearch?.baseForm?.clearValidate();
    }
    return () => (
      <div>
        <BaseTable {...tableProps} ref={baseTable}></BaseTable>
        <ElButton onClick={onClick}>aaa</ElButton>
      </div>
    );
  },
});
