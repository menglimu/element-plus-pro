import { ElTable, ElTableColumn } from "element-plus";
import { Ref, VNode } from "vue";
import { BaseTableSelfType, getFormatters } from "./config";
import { BaseTableInnerBtn, useInnerBtn } from "../TableButton";
import { TableProps } from "element-plus/es/components/table/src/table/defaults";
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { UseOptionsProps } from "@/components/BaseForm/hooks/useOptions";

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

/** 表格的具体项配置，更多内容可参考 UI框架中的表格组件 */
export interface BaseTableColumn<D = AnyObj> extends UseOptionsProps, Omit<Partial<TableColumnCtx<D>>, "type"> {
  /** 表格中的类型包括 */
  type?: BaseTableSelfType | "index" | "selection";

  /** 是否显示列 默认 true */
  hide?: boolean | (() => boolean);

  /** 自定义整列内容，应返回<el-table-column></c-table-column> */
  renderColumn?: () => VNode;
}

export interface BaseTableConfig<D = AnyObj> extends Partial<TableProps<D>> {
  /** 多选，默认false */
  selection?: boolean;
  /** 多选时候，分页，保存选择状态 */
  reserveSelection?: boolean;

  /** 序号 默认false */
  index?: boolean;

  /** 表格操作宽度 */
  tableOptWidth?: string;
  /** 表格内按钮 */
  innerBtn?: BaseTableInnerBtn<D>[];

  /** 表格的具体项 */
  columns: Array<BaseTableColumn<D>>;
}

interface Iprops {
  config: BaseTableConfig;
  data: AnyObj[];
  del?: (rows: AnyObj[]) => Promise<void>;
  elTable?: Ref<InstanceType<typeof ElTable> | undefined>;
}
export default FC<Iprops, {}, EventEmits>({
  name: "TableContent",
  props: ["data", "config", "del", "elTable"],
  setup(props, { attrs }) {
    const { config, data, del } = $(props);

    const renderInnerBtn = useInnerBtn(config, del);

    const formatters = getFormatters(config);
    function renderColumn() {
      return config.columns.map((item) => {
        if (item.hide === false || (typeof item.hide === "function" && !item.hide())) {
          return null;
        }
        if (item.type === "index" || item.type === "selection") {
          return <ElTableColumn align="center" {...item} />;
        }
        if (item.renderColumn) {
          return item.renderColumn();
        }

        return <ElTableColumn {...{ ...columnDefaultNormal, ...item, formatter: item.formatter ? item.formatter : item.type ? formatters[item.type] : undefined }}></ElTableColumn>;
      });
    }

    //   <!-- 表格内容 -->
    return function renderTable() {
      return (
        <ElTable border ref={props.elTable} {...config} {...attrs} data={data}>
          {(config.selection ?? true) && <ElTableColumn {...columnDefaultSelection} reserve-selection={config.reserveSelection} />}
          {config.index && <ElTableColumn {...columnDefaultIndex} />}
          {renderColumn()}
          {renderInnerBtn()}
        </ElTable>
      );
    };
  },
});
