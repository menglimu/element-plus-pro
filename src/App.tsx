// import { ElButton } from "element-plus";
import { BaseTableProps } from "types/table";
import { ref } from "vue";
import BaseForm from "./components/BaseForm";

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
    return () => (
      <div>
        112312341
        <BaseForm config={{ columns: [{ label: "啊啊啊", prop: "a" }] }} />
        {/* <ElButton icon={""}>22</ElButton>
        <el-button icon>xxx</el-button> */}
      </div>
    );
  },
});
