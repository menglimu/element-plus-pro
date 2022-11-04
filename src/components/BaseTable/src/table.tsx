import { getIcon, getJudge } from "@/utils";
import { ElButton, ElTable, ElTableColumn, useForwardRef } from "element-plus";
import { Table } from "element-plus/es/components/table/src/table/defaults";
import { BaseTableProps, MlTableConfig, MlTableInnerBtn } from "types/table";
import { Ref, ref } from "vue";
import useConfig from "./config";
import { onDelete } from "./outerBtn";

// 按钮显示、可用判断
function showJudgeInner(btn: MlTableInnerBtn, row: AnyObj): boolean {
  if (btn.showJudge) {
    if (typeof btn.showJudge === "function") {
      return btn.showJudge(row);
    }
    return getJudge(btn.showJudge, row);
  }
  return true;
}

const columnDefaultIndex = {
  type: "index",
  label: "序号",
  width: "50",
  align: "cetner",
};
const columnDefaultSelection = {
  type: "selection",
  width: "50",
  align: "center",
};

const columnDefaultNormal = {
  align: "left",
  showOverflowTooltip: true,
};

const columnDefaultControl = {
  align: "center",
  label: "操作",
  fixed: "right",
};

export default function useTable(props: BaseTableProps, data: Ref<AnyObj[]>, refresh: () => void) {
  const config_ = useConfig(props);
  const table = ref<Table<AnyObj>>();

  let multipleSelection = $ref<AnyObj[]>([]);

  // 表格内部按钮点击处理
  function handleInnerBtn(row: AnyObj, btn: MlTableInnerBtn) {
    switch (btn.evtType) {
      case "mldelete":
        return onDelete([row], props, refresh);
      default:
        return btn?.callback?.(row);
    }
  }

  function renderInnerBtn() {
    if (!props.innerBtn?.length) {
      return;
    }
    return (
      <ElTableColumn {...{ props: columnDefaultControl }} width={props.config.tableOptWidth}>
        {{
          default: (scope: any) =>
            props.innerBtn
              ?.filter((btn) => showJudgeInner(btn, scope.row))
              .map((btn, index) => {
                if (btn.render) {
                  return btn.render(scope);
                }
                return (
                  //     <!-- <el-tooltip v-for="(btn, index) in innerBtnGroup" :key="index" :content="btn.name" effect="dark" placement="top"> -->
                  <ElButton key={index} {...btn} class="inner-btn" onClick={() => handleInnerBtn(scope.row, btn)}>
                    {getIcon(btn.icon)}
                    {btn.name}
                  </ElButton>
                );
              }),
        }}
      </ElTableColumn>
    );
  }

  // 获取选择的项
  function handleSelectionChange(val: AnyObj[]) {
    multipleSelection = val;
  }

  function renderColumn() {
    return config_.columns.map((item, index) => {
      if (item.showJudge === false) {
        return null;
      }
      if (typeof item.showJudge === "function" && item.showJudge() === false) {
        return null;
      }
      if (item.type === "index" || item.type === "selection") {
        return <ElTableColumn align="center" {...item} />;
      }
      if (item.renderColumn) {
        return item.renderColumn();
      }
      return (
        <ElTableColumn key={item.key || item.prop || index} {...{ ...columnDefaultNormal, ...item }}>
          {{
            default: (scope: any) =>
              item.render ? item.render(scope) : <span class="td-text">{item.prop ? scope.row[item.prop] : null}</span>,
          }}
        </ElTableColumn>
      );
    });
  }
  console.log(data.value);

  //   <!-- 表格内容 -->
  function renderTable() {
    return (
      <ElTable ref={table} {...config_} data={data.value}>
        {config_.selection && (
          <ElTableColumn {...columnDefaultSelection} reserve-selection={config_.reserveSelection} />
        )}
        {config_.index && <ElTableColumn {...columnDefaultIndex} />}
        {renderColumn()}
        {renderInnerBtn()}
        {/* {renderTableSlot()} */}
      </ElTable>
    );
  }
  return {
    table,
    multipleSelection,
    renderTable,
  };
}
