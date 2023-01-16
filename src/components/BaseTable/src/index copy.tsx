// import { ElTable, PaginationProps } from "element-plus";
// import { Table } from "element-plus/es/components/table/src/table/defaults";
// import {
//   BaseTableProps,
//   MlTableConfig,
//   MlTableInnerBtn,
//   MlTableOuterBtn,
//   ResponseData,
//   TableSearchProp,
// } from "types/table";
// import { defineComponent, getCurrentInstance, onMounted, PropType, ref, UnwrapNestedRefs, VNode } from "vue";
// import useConfig from "./config";
// import useOuterBtn from "./outerBtn";
// import usePagination from "./pagination";
// // import useTable from "./table";
// import TableBox from "./table";

// /**
//  * @Author: wenlin
//  * @Description: 表格组件
//  */

// export default functionComponent<BaseTableProps>(function BaseTable(props) {
//   return () => (
//     <div
//       class="ml-table"
//       onClick={() => {
//         aaaa++;
//         // console.log(table.value);
//       }}
//     >
//       {aaaa}
//       {/* {renderSearch()} */}
//       {renderOuerBtn()}
//       {/* {$slots.default} */}
//       {/* {$scopedSlots.table ? $scopedSlots.table({ data: data, columns: config_.columns }) : renderTable(h)} */}
//       {/* {renderTable?.value} */}

//       <ElTable>{console.log(2234353)}</ElTable>
//       {renderPagination()}
//     </div>
//   );
// });

// // import Vue from "vue";
// // import "./table.scss";
// // import { CreateElement, PropType, VNode } from "vue/types/umd";
// // import {
// //   TableSearchProp,
// //   MlTableConfig,
// //   MlTableInnerBtn,
// //   MlTableOuterBtn,
// //   MlTableDefaultOptions,
// //   MlTableColumn,
// //   TableParams,
// // } from "types/table";
// // import Tags from "../../../utils/tags";
// // import emptyImg from "./../assets/no-data.png";
// // import { Pagination } from "element-ui";
// // import { ElTable } from "element-ui/types/table";
// // import { columnsHandler } from "./columnsContent";
// // import merge from "@/utils/merge";
// // import { cloneDeep } from "lodash";
// // import { getJudge } from "@/utils";
// // import TableSearch from "./table-search";
// // import { MlFormConfig } from "types/form";

// // export default Vue.extend({
// //   name: "MlTable",
// //   inheritAttrs: false,
// //   props: {

// //   }
// //   data() {
// //     return {

// //     };
// //   }
// //   computed: {
// //     paginationConfig_(this: any) {
// //       const obj = Object.assign(paginationConfigDefault, paginationConfig || {});
// //       if (!pageSize) {
// //         pageSize = obj.pageSize;
// //       }
// //       return obj;
// //     }
// //     /** 表格内按钮 */
// //     innerBtn_(this: any): MlTableInnerBtn[] {
// //       return innerBtn;
// //     }
// //     /** 表格外按钮 */
// //     outerBtn_(this: any): MlTableOuterBtn[] {
// //       return outerBtn;
// //     }
// //   }
// //   created() {
// //     $watch("config", onConfigChange, { deep: true, immediate: true });
// //     defaultOptions = (this as any).MlTable;
// //     if (defaultOptions) {
// //       for (const key in defaultOptions) {
// //         if (typeof defaultOptions[key] === "object") {
// //           this[key] = merge(this[key], defaultOptions[key]);
// //         } else {
// //           this[key] = defaultOptions[key];
// //         }
// //       }
// //     }
// //     tags = new Tags(framework);
// //     if (searchConfig?.initialValue) {
// //       searchInput = merge(searchInput, searchConfig.initialValue);
// //     }
// //   }

// //   methods: {
// //   }
// //   render(h: CreateElement) {
// //     return (

// //     );
// //   }
// // });
// const Porps = {
//   initSearch: { type: Boolean, default: true },
//   /** 表格搜索配置项  */
//   searchConfig: { type: Object as PropType<TableSearchProp>, required: false },
//   /** 表格配置项 */
//   config: { type: Object as PropType<MlTableConfig>, required: true },
//   /** 搜索表单附加值，会被输入框中的值覆盖 */
//   searchData: { type: Object as PropType<AnyObj>, default: () => ({}) },

//   /** 表格内按钮 */
//   innerBtn: { type: Array, default: (): MlTableInnerBtn[] => [] },

//   /** 表格外按钮 */
//   outerBtn: { type: Array, default: (): MlTableOuterBtn[] => [] },

//   /** 分页配置 */
//   paginationConfig: { type: Object as PropType<PaginationProps | false>, default: () => ({}) },

//   /** 数据加载前的钩子函数 */
//   beforeGetList: { type: Function as PropType<(type: string, params: any) => any> },

//   /** 数据加载后的钩子函数 */
//   afterGetList: { type: Function as PropType<(type: string, res: any) => void> },
// };
// defineComponent({
//   props: Porps,
//   setup(props, ctx) {
//     let data = ref<AnyObj[]>([]);
//     let loading = $ref(false);
//     let searchInput = $ref({});
//     console.log($$(data));

//     // const { table, multipleSelection, renderTable } = useTable(props, data, refresh);
//     let { pageSize, currentPage, total, renderPagination } = $(usePagination(props, search));
//     const renderOuerBtn = useOuterBtn(props, $$(data), [], refresh);

//     //       defaultOptions: null as MlTableDefaultOptions,
//     //       // 表格组件默认配置项
//     //       paginationConfigDefault: {
//     //         pageSizes: [10, 20, 30],
//     //         pageSize: 10,
//     //         background: true,
//     //         layout: "total, sizes, prev, pager, next, jumper",
//     //       }
//     //       configDefault: {
//     //         tableKey: "id",
//     //         selection: false,
//     //         reserveSelection: true,
//     //         initSearch: true,
//     //       }
//     //       TableDefault: {
//     //         "element-loading-text": "拼命加载中",
//     //         "element-loading-spinner": "el-icon-loading",
//     //         "element-loading-background": "rgba(0, 0, 0, 0.8)",
//     //       }

//     //       emptyWord: "暂无数据",
//     //       emptyImg,
//     //       elTable: null as ElTable,
//     //       mlForm: null,

//     onMounted(() => {
//       // 初始化的时候，是否直接搜索数据
//       if (props.initSearch) {
//         search("init");
//       }
//       // elTable = $refs.table as ElTable;
//       // mlForm = ($refs as any).tableSearch?.$refs?.searchForm;
//       // $nextTick(() => (elTable = $refs.table))
//     });

//     // 刷新表格数据
//     function refresh() {
//       search("refresh");
//     }

//     // 重置查询条件并搜索
//     // @Provide()
//     async function onReset(data: AnyObj = {}) {
//       resetPageNum();
//       await search("reset", data || {});
//     }
//     // @Provide()
//     async function onSearch(data: AnyObj = {}) {
//       resetPageNum();
//       await search("searchBtn", data || {});
//     }
//     // 如果是由搜索/重置按钮触发的,重置分页相关参数
//     function resetPageNum() {
//       // pageSize = 10
//       currentPage = 1;
//     }

//     // 刷新头部状态
//     // function forceUpdateTableHeader() {
//     //   table.value?.update?.()
//     // }

//     // 搜索
//     async function search(type = "", param: AnyObj = {}) {
//       if (!props.api?.list) {
//         return;
//       }
//       // expand-row-keys
//       loading = true;
//       data.value = [];
//       const pager = props.paginationConfig !== false ? { pageSize: pageSize, pageNum: currentPage } : {};
//       let params = {
//         ...pager,
//         ...props.params,
//         ...searchInput,
//         ...param,
//       };

//       if (props.beforeGetList) {
//         params = props.beforeGetList(type, params) || params;
//       }
//       let res: ResponseData;
//       try {
//         res = await props.api.list(params);
//         total = Number(res.total) || 0;
//         data.value = res?.content || [];
//         if (data.value.length === 0 && currentPage > (Math.ceil(total / pageSize) || 1)) {
//           currentPage = 1;
//           search("errorPage-reset");
//         }
//       } catch (error) {
//         console.error(error);
//         res = error as any;
//       }
//       // if (type === "sort") {
//       //   forceUpdateTableHeader();
//       // }
//       console.log(data);

//       loading = false;
//       props.afterGetList?.(type, res);
//     }

//     // // 搜索表单
//     // function  renderSearch() {
//     //   return $scopedSlots.search ? (
//     //     $scopedSlots.search({ search: onSearch, reset: onReset })
//     //   ) : searchConfig?.config?.columns?.length ? (
//     //     <TableSearch
//     //       ref="tableSearch"
//     //       framework={framework}
//     //       v-model={searchInput}
//     //       onSearch={onSearch}
//     //       onReset={onReset}
//     //       {...{ props: searchConfig }}
//     //     />
//     //   ) : null;
//     // }

//     //   <!-- 分页 -->
//     // function  renderPagination() {
//     //   if (paginationConfig === false) {
//     //     return;
//     //   }
//     //   const { TagPagination } = tags;
//     //   return (

//     //   );
//     // }
//     onMounted(() => {
//       // console.log(table.value);
//     });
//     let aaaa = $ref(1);
//     getCurrentInstance();
//     return { data, refresh };
//   },
// });
