/**
 * 表格组件
 */
import Vue from "vue";
import "./table.scss";
import { CreateElement, PropType, VNode } from "vue/types/umd";
import {
  TableSearchProp,
  MlTableConfig,
  MlTableInnerBtn,
  MlTableOuterBtn,
  MlTableDefaultOptions,
  MlTableColumn,
  TableParams,
} from "types/table";
import Tags from "../../../utils/tags";
import emptyImg from "./../assets/no-data.png";
import { Pagination } from "element-ui";
import { ElTable } from "element-ui/types/table";
import { columnsHandler } from "./columnsContent";
import merge from "@/utils/merge";
import { cloneDeep } from "lodash";
import { getJudge } from "@/utils";
import TableSearch from "./table-search";

export default Vue.extend({
  name: "MlTable",
  inheritAttrs: false,
  props: {
    /** 表格搜索配置项  */
    searchConfig: { type: Object as PropType<TableSearchProp>, required: false },
    /** 表格配置项 */
    config: { type: Object as PropType<MlTableConfig>, required: true },
    /** 搜索表单附加值，会被输入框中的值覆盖 */
    searchData: { type: Object as PropType<AnyObj>, default: () => ({}) },

    /** 表格内按钮 */
    innerBtn: { type: Array, default: (): MlTableInnerBtn[] => [] },

    /** 表格外按钮 */
    outerBtn: { type: Array, default: (): MlTableOuterBtn[] => [] },

    /** 分页配置 */
    paginationConfig: { type: Object as PropType<Pagination | false>, default: () => ({}) },

    /** 数据加载前的钩子函数 */
    beforeGetList: { type: Function as PropType<(type: string, params: any) => any> },

    /** 数据加载后的钩子函数 */
    afterGetList: { type: Function as PropType<(type: string, res: any) => void> },
  },
  data() {
    return {
      config_: null as MlTableConfig,
      data: [],
      loading: false, // 加载遮罩
      pageSize: 0,
      currentPage: 1,
      total: 0,
      sortProp: "",
      sortType: "" as "" | "DESC" | "ASC",
      multipleSelection: [], // 多选

      tags: null as Tags,

      searchInput: {},

      defaultOptions: null as MlTableDefaultOptions,
      // 表格组件默认配置项
      paginationConfigDefault: {
        pageSizes: [10, 20, 30],
        pageSize: 10,
        background: true,
        layout: "total, sizes, prev, pager, next, jumper",
      },
      configDefault: {
        tableKey: "id",
        selection: false,
        reserveSelection: true,
        initSearch: true,
      },
      TableDefault: {
        "element-loading-text": "拼命加载中",
        "element-loading-spinner": "el-icon-loading",
        "element-loading-background": "rgba(0, 0, 0, 0.8)",
      },
      columnDefaultIndex: {
        type: "index",
        label: "序号",
        width: "50",
        align: "cetner",
      },
      columnDefaultSelection: {
        type: "selection",
        width: "50",
        align: "center",
      },
      columnDefaultNormal: {
        align: "left",
        showOverflowTooltip: true,
      },
      columnDefaultControl: {
        align: "center",
        label: "操作",
        fixed: "right",
      },
      emptyWord: "暂无数据",
      emptyImg,
      framework: "element-ui",
      outerBtnDefault: {
        size: Vue.prototype.$ELEMENT?.size || "small",
      },
      innerBtnDefault: {
        size: Vue.prototype.$ELEMENT?.size || "small",
      },
      elTable: null as ElTable,
      mlForm: null,
    };
  },
  computed: {
    paginationConfig_(this: any) {
      const obj = Object.assign(this.paginationConfigDefault, this.paginationConfig || {});
      if (!this.pageSize) {
        this.pageSize = obj.pageSize;
      }
      return obj;
    },
    /** 表格内按钮 */
    innerBtn_(this: any): MlTableInnerBtn[] {
      return this.innerBtn;
    },
    /** 表格外按钮 */
    outerBtn_(this: any): MlTableOuterBtn[] {
      return this.outerBtn;
    },
  },
  created() {
    this.$watch("config", this.onConfigChange, { deep: true, immediate: true });
    this.defaultOptions = (this as any).MlTable;
    if (this.defaultOptions) {
      for (const key in this.defaultOptions) {
        if (typeof this.defaultOptions[key] === "object") {
          this[key] = merge(this[key], this.defaultOptions[key]);
        } else {
          this[key] = this.defaultOptions[key];
        }
      }
    }
    this.tags = new Tags(this.framework);
    if (this.searchConfig?.initialValue) {
      this.searchInput = merge(this.searchInput, this.searchConfig.initialValue);
    }
  },
  mounted() {
    // 初始化的时候，是否直接搜索数据
    if (this.config_.initSearch === true) {
      this.search("init");
    }
    this.elTable = this.$refs.table as ElTable;
    this.mlForm = (this.$refs as any).tableSearch?.$refs?.searchForm;
    // this.$nextTick(() => (this.elTable = this.$refs.table))
  },
  methods: {
    onConfigChange() {
      const config = { ...this.configDefault, ...cloneDeep(this.config) };
      // 处理表格中每一项的值的显示
      columnsHandler(config);
      this.config_ = config;
    },
    // 内部处理删除逻辑
    async onDelete(data: any[], type?: string) {
      if (!data || data.length === 0) {
        this.$message.warning("请选择要删除的内容");
        return;
      }
      if (this.config_.api?.delete) {
        const ids = data.map((_) => _[this.config_.tableKey]).join(",");
        try {
          await this.$confirm("此操作将永久删除该数据, 是否继续?");
          await this.config_.api?.delete(ids, data);
          this.refresh();
          this.$message.success("删除成功");
          this.$emit("delete-success", ids, data);
        } catch (error) {
          console.log(error);
          this.$emit("delete-error", ids, data);
        }
      } else if (type) {
        if (type === "inner") {
          this.$emit(type, data[0]);
        } else {
          this.$emit(type, this.multipleSelection);
        }
      }
    },
    // 表格内部按钮点击处理
    handleInnerBtn(type: string, row: AnyObj, btn: MlTableInnerBtn) {
      switch (type) {
        case "mldelete":
          this.onDelete([row], "inner");
          break;
        default:
          btn?.callback?.(row);
          type && this.$emit(type, row);
          break;
      }
    },
    // 表格外按钮点击处理
    handleOuterBtn(type: string, btn: MlTableOuterBtn) {
      switch (type) {
        case "mldelete":
          this.onDelete(this.multipleSelection);
          break;
        default:
          btn?.callback?.(this.multipleSelection);
          type && this.$emit(type, this.multipleSelection);
          break;
      }
    },
    // 按钮显示、可用判断
    showJudgeInner(btn: MlTableInnerBtn, row: AnyObj): boolean {
      if (btn.showJudge) {
        if (typeof btn.showJudge === "function") {
          return btn.showJudge(row);
        }
        return getJudge(btn.showJudge, row);
      }
      return true;
    },

    // 获取选择的项
    handleSelectionChange(val: AnyObj[]) {
      this.multipleSelection = val;
    },

    // 刷新表格数据
    refresh() {
      this.search("refresh");
    },

    // 重置查询条件并搜索
    // @Provide()
    async onReset(data: AnyObj = {}) {
      this.resetSort();
      this.resetPageNum();
      await this.search("reset", data || {});
    },
    // @Provide()
    async onSearch(data: AnyObj = {}) {
      this.resetPageNum();
      await this.search("searchBtn", data || {});
    },
    // 重置排序相关
    resetSort() {
      this.elTable?.clearSort();
      this.forceUpdateTableHeader();
      this.sortProp = "";
      this.sortType = "";
    },
    // 如果是由搜索/重置按钮触发的,重置分页相关参数
    resetPageNum() {
      // this.pageSize = 10
      this.currentPage = 1;
    },

    // 分页改变
    handleSizeChange(val: number) {
      this.pageSize = val;
      this.search("size-change");
      this.$emit("size-change", val);
    },
    handleCurrentChange(val: number) {
      this.currentPage = val;
      this.search("current-change");
      this.$emit("current-change", val);
    },
    // 排序
    onSortChange({ column, prop, order }: { column: MlTableColumn; prop: string; order: string }) {
      // const column = this.config_.columns.find(item => item.prop === prop)
      if (column?.sortable === "custom") {
        this.sortProp = prop;
        this.sortType = order === "descending" ? "DESC" : order === "ascending" ? "ASC" : ""; // ACS 顺序，从小到大， DESC倒序，从大到小
        this.search("sort");
      }
    },

    // 刷新头部状态
    forceUpdateTableHeader() {
      (this.$refs?.table as any)?.$refs?.tableHeader?.$forceUpdate();
    },

    // 搜索
    async search(type = "", data: AnyObj = {}) {
      if (!this.config_.api || !this.config_.api.list) {
        return;
      }
      // expand-row-keys
      this.loading = true;
      this.data = [];
      const pager: TableParams =
        this.paginationConfig !== false ? { pageSize: this.pageSize, pageNum: this.currentPage } : {};
      let params = {
        ...pager,
        ...this.searchData,
        ...this.searchInput,
        ...data,
      };
      if (this.sortProp && this.sortType) {
        params.sortColumn = this.sortProp;
        params.sortAsc = this.sortType === "ASC" ? true : false;
      }

      if (this.beforeGetList) {
        params = this.beforeGetList(type, params) || params;
      }
      let res;
      try {
        res = await this.config_.api.list(params);
        this.total = Number(res.total) || 0;
        this.data = res?.content || [];
        if (this.data.length === 0 && this.currentPage > (Math.ceil(this.total / this.pageSize) || 1)) {
          this.currentPage = 1;
          this.search("errorPage-reset");
        }
      } catch (error) {
        console.error(error);
        res = error;
      }
      if (type === "sort") {
        this.forceUpdateTableHeader();
      }
      this.loading = false;
      if (this.afterGetList) {
        this.afterGetList(type, res);
      }
    },

    // 搜索表单
    renderSearch() {
      return this.$scopedSlots.search ? (
        this.$scopedSlots.search({ search: this.onSearch, reset: this.onReset })
      ) : this.searchConfig?.config?.columns?.length ? (
        <TableSearch
          ref="tableSearch"
          framework={this.framework}
          v-model={this.searchInput}
          onSearch={this.onSearch}
          onReset={this.onReset}
          {...{ props: this.searchConfig }}
        />
      ) : null;
    },
    // 外部按钮
    renderOuerBtn(h: CreateElement) {
      if (!this.outerBtn_ || this.outerBtn_.length === 0) {
        return;
      }
      const { TagButton } = this.tags;
      return (
        <div class="outer-btn-box">
          {this.outerBtn_
            .filter((btn) => (btn.showJudge ? btn.showJudge(this.data) : true))
            .map((btn, index) => {
              if (btn.render) {
                return btn.render(h);
              }
              return (
                <TagButton
                  class="outer-btn"
                  key={index}
                  {...{ props: { ...this.outerBtnDefault, ...btn } }}
                  disabled={
                    (btn.selection === "single" && this.multipleSelection.length !== 1) ||
                    (btn.selection === "multiple" && this.multipleSelection.length < 1)
                  }
                  onClick={() => this.handleOuterBtn(btn.evtType, btn)}
                >
                  {btn.Elicon && <i class={["el-icon-" + btn.Elicon]} />}
                  {btn.icon && <svg-icon icon-class={btn.icon} />}
                  {btn.name}
                </TagButton>
              );
            })}
        </div>
      );
    },
    renderInnerBtn(h: CreateElement) {
      if (!this.innerBtn_ || this.innerBtn_.length === 0) {
        return;
      }
      const { TagTableColumn, TagButton } = this.tags;
      return (
        <TagTableColumn
          {...{ props: this.columnDefaultControl }}
          width={this.config_.tableOptWidth}
          scopedSlots={{
            default: (scope: any) =>
              this.innerBtn_
                .filter((btn) => this.showJudgeInner(btn, scope.row))
                .map((btn, index) => {
                  if (btn.render) {
                    return btn.render(h, scope);
                  }
                  return (
                    //     <!-- <el-tooltip v-for="(btn, index) in innerBtnGroup" :key="index" :content="btn.name" effect="dark" placement="top"> -->
                    <TagButton
                      key={index}
                      {...{ props: { ...this.innerBtnDefault, ...btn } }}
                      class="inner-btn"
                      onClick={() => this.handleInnerBtn(btn.evtType, scope.row, btn)}
                    >
                      {btn.Elicon && <i class={["el-icon-" + btn.Elicon]} />}
                      {btn.icon && <svg-icon icon-class={btn.icon} />}
                      {btn.name}
                    </TagButton>
                  );
                }),
          }}
        ></TagTableColumn>
      );
    },
    renderColumn(h: CreateElement) {
      const { TagTableColumn } = this.tags;
      return this.config_.columns.map((item, index) => {
        if (item.hide === true) {
          return null;
        }
        if (typeof item.hide === "function" && item.hide()) {
          return null;
        }
        if (item.type === "index" || item.type === "selection") {
          return <TagTableColumn align="center" {...{ props: item }} />;
        }
        if (item.renderColumn) {
          return item.renderColumn(h);
        }
        return (
          <TagTableColumn
            key={item.key || item.prop || index}
            {...{ props: { ...this.columnDefaultNormal, ...item } }}
            scopedSlots={{
              default: (scope: any) =>
                item.render ? (
                  item.render(h, { column: item, row: scope.row, index: scope.$index })
                ) : (
                  <span class="td-text">{scope.row[item.prop]}</span>
                ),
            }}
          />
        );
      });
    },

    renderTableSlot() {
      const empty = [
        (
          <div class="ml-table-empty" slot="empty">
            <img src={this.emptyImg} class="ml-table-empty-img" />
            <div>{this.emptyWord}</div>
          </div>
        ) as VNode,
      ];

      const slots: { [key: string]: VNode[] | undefined } = { empty, ...this.$slots };
      if (slots.default) {
        delete slots.default;
      }

      const ary: VNode[] = [];
      for (const key in slots) {
        if (Object.prototype.hasOwnProperty.call(slots, key)) {
          ary.push(<template slot={key}>{slots[key]}</template>);
        }
      }
      return ary.map((item) => item);
    },

    //   <!-- 表格内容 -->
    renderTable(h: CreateElement) {
      const tableNodeData = merge(
        {
          attrs: this.TableDefault,
        },
        {
          props: this.config_,
        },
        this.config_.nodeData,
        {
          directives: [{ name: "loading", value: this.loading }],
          on: {
            "sort-change": this.onSortChange,
            "selection-change": this.handleSelectionChange,
          },
        },
        {
          on: this.$listeners,
          attrs: this.$attrs,
        }
      );

      const { TagTable, TagTableColumn } = this.tags;
      return (
        <TagTable ref="table" data={this.data} row-key={this.config_.tableKey} {...tableNodeData}>
          {this.config_.selection && (
            <TagTableColumn
              {...{ props: this.columnDefaultSelection }}
              reserve-selection={this.config_.reserveSelection}
            />
          )}
          {this.config_.index && <TagTableColumn {...{ props: this.columnDefaultIndex }} />}
          {this.renderColumn(h)}
          {this.renderInnerBtn(h)}
          {this.renderTableSlot()}
        </TagTable>
      );
    },
    //   <!-- 分页 -->
    renderPagination() {
      if (this.paginationConfig === false) {
        return;
      }
      const { TagPagination } = this.tags;
      return (
        <TagPagination
          current-page={this.currentPage}
          total={this.total}
          class="ml-table-pagination"
          {...{
            props: this.paginationConfig_,
            on: { "size-change": this.handleSizeChange, "current-change": this.handleCurrentChange },
          }}
        />
      );
    },
  },
  render(h: CreateElement) {
    return (
      <div class="ml-table">
        {this.renderSearch()}
        {this.renderOuerBtn(h)}
        {this.$slots.default}
        {this.$scopedSlots.table
          ? this.$scopedSlots.table({ data: this.data, columns: this.config_.columns })
          : this.renderTable(h)}
        {this.renderPagination()}
      </div>
    );
  },
});
