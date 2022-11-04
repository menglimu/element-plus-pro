import { getIcon } from "@/utils";
import { ElButton, ElMessage, ElMessageBox } from "element-plus";
import { BaseTableProps, MlTableOuterBtn } from "types/table";
import { Ref } from "vue";

// 内部处理删除逻辑
export async function onDelete(data: Ref<AnyObj[]>, props: BaseTableProps, refresh: () => void) {
  if (!data?.length) {
    ElMessage.warning("请选择要删除的内容");
    return;
  }
  if (props.api?.delete) {
    const rowKey = props.config.rowKey;
    let ids: string = data.map((_) => _[typeof rowKey === "function" ? rowKey(_) : rowKey!]).join(",");

    try {
      await ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?");
      await props.api?.delete(ids, data);
      refresh();
      ElMessage.success("删除成功");
      props.onDelete?.("success", ids, data);
    } catch (error) {
      console.log(error);
      props.onDelete?.("error", ids, data);
    }
  }
}

export default function useOuterBtn(
  props: BaseTableProps,
  data: AnyObj[],
  multipleSelection: AnyObj[],
  refresh: () => void
) {
  // 表格外按钮点击处理
  function handleOuterBtn(btn: MlTableOuterBtn) {
    switch (btn.evtType) {
      case "mldelete":
        return onDelete(multipleSelection, props, refresh);
      default:
        return btn?.callback?.(multipleSelection);
    }
  }

  // 外部按钮
  return function renderOuerBtn() {
    if (!props.outerBtn?.length) {
      return;
    }
    return (
      <div class="outer-btn-box">
        {props.outerBtn
          .filter((btn) => (btn.showJudge ? btn.showJudge(data) : true))
          .map((btn, index) => {
            if (btn.render) {
              return btn.render();
            }
            return (
              <ElButton
                class="outer-btn"
                key={index}
                {...{ props: { ...btn } }}
                disabled={
                  (btn.selection === "single" && multipleSelection.length !== 1) ||
                  (btn.selection === "multiple" && multipleSelection.length < 1)
                }
                onClick={() => handleOuterBtn(btn)}
              >
                {getIcon(btn.icon)}
                {btn.name}
              </ElButton>
            );
          })}
      </div>
    );
  };
}
