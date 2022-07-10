/**
 * 回显组件
 */
import { isNull } from "@/utils";
import { MlInfoColumn } from "types/info";
import Vue from "vue";
import { CreateElement } from "vue/types/umd";
import { formatterFormValue, getImage } from "../BaseTable/src/columnsContent";
import("./index.scss");

export default Vue.extend({
  name: "MlInfo",
  props: {
    title: String,
    labelWidth: { default: "auto" },
    width: { default: "50%" },
    labelSuffix: { default: "：" },
    columns: {
      default: (): MlInfoColumn[] => [],
    },
    data: {
      default: (): AnyObj => ({}),
    },
    request: { type: Function },
  },
  data() {
    return {
      loading: false,
      data_: {},
    };
  },
  computed: {
    // TODO: 多次修改，请求接口的优化   此处修改了原值。。
    columns_() {
      return this.columns.map((column) => {
        if (typeof column.optionsGet === "function") {
          // column.options = [];
          this.$set(column, "options", []);
          column.optionsGet().then((res) => {
            let list = [];
            if (Array.isArray(res)) {
              list = res;
            }
            if ("content" in res && Array.isArray(res.content)) {
              list = res.content;
            }
            column.options.push(...list);
          });
        }
        return column;
      });
    },
  },
  async created() {
    this.$watch(
      "data",
      () => {
        this.data_ = this.data;
      },
      { immediate: true, deep: true },
    );
    if (this.request) {
      this.loading = true;
      try {
        this.data_ = await this.request();
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    }
  },
  methods: {
    // 根据不同类型，获取值
    getValue(h: CreateElement, column: MlInfoColumn) {
      let value = this.data_?.[column.prop];
      if (column.type === "image") {
        value = getImage(value, column, "", h);
      } else if (column.type === "svg") {
        value = <svg-icon class="td-svg" icon-class={value} />;
      } else {
        value = formatterFormValue(value, column);
      }
      return value;
    },
    // 渲染每一项
    renderItem(h: CreateElement, column: MlInfoColumn) {
      let value = this.data_?.[column.prop];

      let content =
        typeof column.formatter === "function" ? column.formatter(value, this.data_) : this.getValue(h, column);
      return (
        <div
          class={[
            "ml-info-item",
            column.className,
            column.rows ? "ml-info-ells" : column.rows !== 0 ? "ml-info-ell" : "",
          ]}
          style={{ width: column.width || this.width }}
        >
          {column.label && (
            <span class="ml-info-label" style={{ width: column.labelWidth || this.labelWidth }}>
              {column.label}
              {this.labelSuffix}
            </span>
          )}
          {column.render ? (
            column.render(h, value, this.data_, column)
          ) : (
            <span v-global-tooltip class="ml-info-value" style={{ webkitLineClamp: column.rows }}>
              {isNull(content) ? "--" : content}
            </span>
          )}
        </div>
      );
    },
  },
  render(h) {
    return (
      <div
        class="ml-info"
        v-loading={this.loading}
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        attrs={this.$attrs}
      >
        {this.title ? <div class="ml-info-title">{this.title}</div> : null}
        <div class="ml-info-content">{this.columns_.map((item) => this.renderItem(h, item))}</div>
      </div>
    );
  },
});
