/**
 * @Author: wenlin
 * @Description: 表格组件
 */

import { ElMessage, ElMessageBox, ElTable, PaginationProps } from "element-plus";
import { Ref, UnwrapNestedRefs, onMounted, reactive, ref, toRef, watchEffect } from "vue";
import TablePagination from "../components/TablePagination";
import { BaseTableOuterBtn, useOuterBtn } from "../components/TableButton";
import TableSearch, { BaseTableSearchExpose, BaseTableSearchProps } from "../components/TableSearch";
import TableContent, { BaseTableConfig } from "../components/TableContent";
import { BaseFormExpose } from "@/components/BaseForm/src/Form";
import "./table.scss";

export type FetchListFn = (type?: "" | "search" | "reset" | "init" | "refresh" | "size" | "current", data?: AnyObj) => Promise<void>;
interface ResponseData<D = AnyObj> {
  total: number;
  content: D[];
}
interface TableParams {
  pageSize?: number;
  pageNum?: number;
  // [P in keyof S]?: S[P]
}
export interface BaseTableProps<D = AnyObj, S = AnyObj> {
  /** 表格头部搜索项 */
  searchProps?: BaseTableSearchProps;

  /** 搜索表单附加值，会被输入框中的值覆盖 */
  params?: AnyObj;
  /** 初始化的时候，是否直接请求数据，默认 true */
  initSearch?: boolean;
  /** 数据加载前的钩子函数，可处理请求参数，也可在api中的list方法中处理请求 */
  beforeGetList?: (type: string, params: S & TableParams) => AnyObj;
  /** 数据加载后的钩子函数 */
  afterGetList?: (type: string, res: ResponseData<D>) => void;
  /** 请求的接口列表 */
  api?: {
    /**
     * 删除接口，evtType为mldelete时触发内部删除并使用该方法
     * @param {String} ids id拼接的字符串
     * @param {Array} data 要删除的数据列表
     */
    delete?: (ids: string, data?: D[]) => Promise<any>;

    /** 查询列表数据 */
    list?: (data: S & TableParams) => Promise<ResponseData<D>>;

    /** 导入数据 */
    // import?: (data: S & TableParams) => Promise<any>;

    /** 导出数据 */
    // export?: (data: S & TableParams) => Promise<any>;
  };
  /** 静态数据 */
  dataSource?: D[];

  /** 表格的标题 */
  title?: string;
  /** 表格外按钮 */
  outerBtn?: BaseTableOuterBtn<D>[];
  /** 表格配置项 */
  config: BaseTableConfig<D>;

  /** 分页相关配置项 */
  paginationProps?: Partial<PaginationProps> | false;
}

interface IExpose<D extends AnyObj = AnyObj, S extends AnyObj = AnyObj> {
  fetchList: FetchListFn;
  refresh: () => Promise<void>;
  baseForm: Ref<BaseFormExpose | undefined>;
  elTable: Ref<InstanceType<typeof ElTable> | undefined>;
  searchData: Ref<S>;
  selection: Ref<D[]>;
  data: Ref<D[]>;
}
export type BaseTableExpose<D extends AnyObj = AnyObj, S extends AnyObj = AnyObj> = UnwrapNestedRefs<IExpose<D, S>>;

export default FC<BaseTableProps, IExpose, EventEmits>({
  name: "BaseTable",
  props: ["searchProps", "params", "initSearch", "beforeGetList", "afterGetList", "api", "dataSource", "title", "outerBtn", "config", "paginationProps"],
  setup(props, { expose }) {
    const tableSearch = ref<BaseTableSearchExpose>();
    const baseForm = ref<BaseFormExpose>();
    const elTable = ref<InstanceType<typeof ElTable>>();
    let searchData = $ref({});

    let data = $ref<AnyObj[]>([]);
    let loading = $ref(false);
    let selection = $ref<AnyObj[]>([]);

    const paginationProps = toRef(props, "paginationProps");
    let { pageSize, currentPage, total, renderPagination } = $(TablePagination(paginationProps, fetchList));

    const renderOuerBtn = useOuterBtn(props.outerBtn, $$(selection), del);

    expose({
      baseForm,
      elTable,
      searchData: $$(searchData),
      selection: $$(selection),
      data: $$(data),
      refresh,
      fetchList,
    });
    onMounted(() => {
      // 初始化的时候，是否直接搜索数据
      if (props.initSearch ?? true) {
        fetchList("init");
      }
      baseForm.value = tableSearch?.value?.baseForm;
    });

    // 获取选择的项
    function handleSelectionChange(val: AnyObj[]) {
      selection = val;
    }

    // 刷新表格数据
    function refresh() {
      return fetchList("refresh");
    }

    // 搜索
    async function fetchList(type: Parameters<FetchListFn>[0] = "", param: AnyObj = {}) {
      if (!props.api?.list) return;

      // 如果是由搜索/重置按钮触发的,重置分页相关参数
      if (["search", "reset"].includes(type)) {
        currentPage = 1;
      }

      loading = true;
      data = [];
      const pager = props.paginationProps !== false ? { pageSize: pageSize, pageNum: currentPage } : {};
      let params = {
        ...pager,
        ...props.params,
        ...param,
        ...searchData,
      };

      if (props.beforeGetList) {
        params = props.beforeGetList(type, params) || params;
      }
      let res: ResponseData;
      try {
        res = await props.api.list(params);
        total = Number(res.total) || 0;
        data = res?.content || [];
      } catch (error) {
        console.error(error);
        res = error as any;
      }

      loading = false;
      props.afterGetList?.(type, res);
    }

    // 内部处理删除逻辑
    async function del(rows: AnyObj[]) {
      if (!rows?.length) {
        ElMessage.warning("请选择要删除的内容");
        return;
      }
      if (props.api?.delete) {
        const rowKey = props.config.rowKey;
        let ids: string = rows.map((_) => _[typeof rowKey === "function" ? rowKey(_) : rowKey!]).join(",");

        await ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?");
        await props.api?.delete(ids, rows);
        refresh();
        ElMessage.success("删除成功");
      }
    }

    return () => (
      <div class="baseTable">
        {props.searchProps && <TableSearch v-model={searchData} ref={tableSearch} {...props.searchProps} search={fetchList} />}
        {(props.title || props.outerBtn?.length) && (
          <div class="tableOuter">
            {props.title && <div class="tableTitle">{props.title}</div>}
            {renderOuerBtn()}
          </div>
        )}
        <TableContent elTable={elTable} v-loading={loading} onSelection-change={handleSelectionChange} data={data} config={props.config} />
        {renderPagination()}
      </div>
    );
  },
});

// import Vue from "vue";
// import "./table.scss";
// import { CreateElement, PropType, VNode } from "vue/types/umd";
// import {
//   TableSearchProp,
//   MlTableConfig,
//   MlTableInnerBtn,
//   MlTableOuterBtn,
//   MlTableDefaultOptions,
//   MlTableColumn,
//   TableParams,
// } from "types/table";
// import Tags from "../../../utils/tags";
// import emptyImg from "./../assets/no-data.png";
// import { Pagination } from "element-ui";
// import { ElTable } from "element-ui/types/table";
// import { columnsHandler } from "./columnsContent";
// import merge from "@/utils/merge";
// import { cloneDeep } from "lodash";
// import { getJudge } from "@/utils";
// import TableSearch from "./table-search";
// import { MlFormConfig } from "types/form";

// export default Vue.extend({
//   name: "MlTable",
//   inheritAttrs: false,
//   props: {
//     /** 表格搜索配置项  */
//     searchConfig: { type: Object as PropType<TableSearchProp>, required: false }
//     /** 表格配置项 */
//     config: { type: Object as PropType<MlTableConfig>, required: true }
//     /** 搜索表单附加值，会被输入框中的值覆盖 */
//     searchData: { type: Object as PropType<AnyObj>, default: () => ({}) }

//     /** 表格内按钮 */
//     innerBtn: { type: Array, default: (): MlTableInnerBtn[] => [] }

//     /** 表格外按钮 */
//     outerBtn: { type: Array, default: (): MlTableOuterBtn[] => [] }

//     /** 分页配置 */
//     paginationConfig: { type: Object as PropType<Pagination | false>, default: () => ({}) }

//     /** 数据加载前的钩子函数 */
//     beforeGetList: { type: Function as PropType<(type: string, params: any) => any> }

//     /** 数据加载后的钩子函数 */
//     afterGetList: { type: Function as PropType<(type: string, res: any) => void> }
//   }
//   data() {
//     return {

//     };
//   }
//   computed: {
//     paginationConfig_(this: any) {
//       const obj = Object.assign(paginationConfigDefault, paginationConfig || {});
//       if (!pageSize) {
//         pageSize = obj.pageSize;
//       }
//       return obj;
//     }
//     /** 表格内按钮 */
//     innerBtn_(this: any): MlTableInnerBtn[] {
//       return innerBtn;
//     }
//     /** 表格外按钮 */
//     outerBtn_(this: any): MlTableOuterBtn[] {
//       return outerBtn;
//     }
//   }
//   created() {
//     $watch("config", onConfigChange, { deep: true, immediate: true });
//     defaultOptions = (this as any).MlTable;
//     if (defaultOptions) {
//       for (const key in defaultOptions) {
//         if (typeof defaultOptions[key] === "object") {
//           this[key] = merge(this[key], defaultOptions[key]);
//         } else {
//           this[key] = defaultOptions[key];
//         }
//       }
//     }
//     tags = new Tags(framework);
//     if (searchConfig?.initialValue) {
//       searchInput = merge(searchInput, searchConfig.initialValue);
//     }
//   }

//   methods: {
//   }
//   render(h: CreateElement) {
//     return (

//     );
//   }
// });
