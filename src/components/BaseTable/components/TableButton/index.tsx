import { getJudge } from "@/utils";
import { ElTableColumn } from "element-plus";
import { Ref, VNodeChild } from "vue";
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { BaseTableConfig } from "../TableContent";
import ButtonGroup, { GroupButton } from "@/components/ButtonGroup";

const columnDefaultControl = {
  align: "center",
  label: "操作",
  fixed: "right",
};

type ColumnRender = (scoped: { row: AnyObj; column: TableColumnCtx<AnyObj>; $index: number }) => VNodeChild;

/** 表格内按钮配置。其他配置内容可参考 按钮组件参数 */
export interface BaseTableInnerBtn<D = AnyObj> extends Omit<GroupButton, "hideJudge" | "callback" | "render"> {
  /** 触发的事件类型 */
  evtType?: "mldelete";
  /** 点击的回调函数，可以不通过事件监听的方式 */
  callback?: (row: D) => void;
  /** 可使用函数返回true/false，判断显示，参数为行数据，使用对象的时候，对象内的每个属性和行数据相等时可用 */
  hideJudge?: AnyObj | ((row: D) => boolean); // {status: 1,title: '123'}
  /** 自定义按钮或其他的 */
  render?: ColumnRender;
}

// 按钮显示、可用判断
function hideJudgeInner(btn: BaseTableInnerBtn, row: AnyObj): boolean {
  if (btn.hideJudge) {
    if (typeof btn.hideJudge === "function") {
      return btn.hideJudge(row);
    }
    return getJudge(btn.hideJudge, row);
  }
  return false;
}

export function useInnerBtn(config: BaseTableConfig, del?: (rows: AnyObj[]) => Promise<void>) {
  // 表格内部按钮点击处理
  async function handleInnerBtn(btn: BaseTableInnerBtn, row: AnyObj) {
    switch (btn.evtType) {
      case "mldelete":
        const res = await del?.([row]);
        return btn.callback?.(row);
      default:
        return btn?.callback?.(row);
    }
  }

  return function renderInnerBtn() {
    if (!config.innerBtn?.length) return;
    return (
      <ElTableColumn {...columnDefaultControl} width={config.tableOptWidth}>
        {{
          default: (scoped: Parameters<ColumnRender>[0]) => {
            const btns = config.innerBtn?.map((item) => {
              const { evtType, ...others } = item;
              return {
                text: true,
                ...others,
                hideJudge: () => hideJudgeInner(item, scoped.row),
                callback: () => handleInnerBtn(item, scoped.row),
                render: item.render ? () => item.render!(scoped) : undefined,
              };
            });
            return <ButtonGroup btns={btns} class="outerBtnBox"></ButtonGroup>;
          },
        }}
      </ElTableColumn>
    );
  };
}

/** 表格外按钮配置 */
export interface BaseTableOuterBtn<D = AnyObj> extends Omit<GroupButton, "hideJudge" | "callback" | "render"> {
  /** false   不选,(其他值)， 单选，多选， */
  selection?: "none" | "single" | "multiple" | "";
  /** 触发的事件类型 */
  evtType?: "mldelete";

  /** 与 innerBtn不同，只能使用函数返回true/false */
  hideJudge?: (rows: D[]) => boolean;
  /** 点击的回调函数，可以不通过事件监听的方式 */
  callback?: (rows: D[]) => void | Promise<any>;
  /** 自定义按钮或其他的 */
  render?: (rows: D[]) => VNodeChild;
}
export function useOuterBtn(outerBtn: BaseTableOuterBtn[] | undefined, rows_: Ref<AnyObj[]>, del?: (rows: AnyObj[]) => Promise<void>) {
  const rows = $(rows_);
  const btns = $computed(() =>
    outerBtn?.map((item) => {
      const { selection, evtType, ...others } = item;
      return {
        ...others,
        hideJudge: item.hideJudge ? () => item.hideJudge!(rows) : undefined,
        callback: () => handleOuterBtn(item),
        render: item.render ? () => item.render!(rows) : undefined,
      };
    })
  );
  // 表格外按钮点击处理
  function handleOuterBtn(btn: BaseTableOuterBtn) {
    switch (btn.evtType) {
      case "mldelete":
        return del?.(rows);
      default:
        return btn?.callback?.(rows);
    }
  }

  // 外部按钮
  return () => <ButtonGroup btns={btns} class="outerBtnBox"></ButtonGroup>;
}
