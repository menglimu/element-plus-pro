/**
 * 表单的单项
 */
import Vue, { VNode, defineComponent, PropType } from "vue";
import { isNull } from "@/utils";
import { isEqual } from "lodash";
import merge from "@/utils/merge";
import { MlFormColumn, MlFormConfig } from "types/form";
import { getFormColumn } from "./config";

export default defineComponent({
  name: "FormItem",
  props: {
    configItem: { type: Object as PropType<MlFormColumn>, required: true },
    // 原始的value值，涉及到数据格式化转换问题，通过一个值进行中转
    originalValue: { type: null, required: true },
    rootValue: { type: null, required: true },
    rootConfig: { type: Object as PropType<MlFormConfig>, required: true },
  },
  data() {
    const config_: MlFormColumn = undefined;
    return {
      // show: null, // 是否显示隐藏
      // beforeHideValue: null, // 隐藏前的值，进行保存，显示的时候，再进行回显
      options: [] as AnyObj[], // 下拉，单选，多选等的选择项
      config_: config_,
    };
  },
  computed: {
    value() {
      let value = this.originalValue;
      if (this.config_?.format?.toEleValue) {
        value = this.config_.format.toEleValue(value, this.rootValue);
      }
      return value;
    },
    isShow(): boolean | undefined {
      let isShow: boolean | undefined;
      if (typeof this.config_.show === "function") {
        isShow = this.config_.show(this.rootValue);
      } else {
        isShow = this.config_.show;
      }

      // 显示隐藏。不删除隐藏掉的值。暂时不用处理
      // 重新显示的时候，将之前的值抛出给父组件
      // if (isShow && this.show === false) {
      //   this.$emit("show", this.beforeHideValue);
      // } else if (!isShow && this.show === true) {
      //   // 切换不显示的时候，重置值
      //   this.beforeHideValue = cloneDeep(this.value);
      //   this.$emit("hide", this.config_.prop);
      // }
      // this.show = isShow;
      return isShow;
    },
  },
  created() {
    this.$watch("configItem", this.onConfigChange, { immediate: true, deep: true });
    this.$watch("configItem.optionsGet", this.onOptionsGetChange, { immediate: true });
  },
  methods: {
    async onConfigChange() {
      this.config_ = getFormColumn(this.configItem, this.rootConfig);
    },

    async onOptionsGetChange() {
      if (typeof this.config_.optionsGet === "function") {
        const res = await this.config_.optionsGet();
        if (Array.isArray(res)) {
          this.options = res;
        }
        if ("content" in res && Array.isArray(res.content)) {
          this.options = res.content;
        }
      }
    },
    onInput(value: any) {
      if (isEqual(this.value, value)) {
        return;
      }
      let val = value;
      if (this.config_?.format?.toValue) {
        val = this.config_.format.toValue(val, this.rootValue);
      }
      this.$emit("input", val);
      (this.$refs?.formItem as ElFormItem)?.$emit("el.form.change");
    },

    renderChildren(h: CreateElement): VNode | VNode[] | Element | Element[] {
      if (typeof this.config_.children === "function") {
        return this.config_.children(h);
      }
      const options = isNull(this.options) ? this.config_.options : this.options;
      if (["radio", "checkbox", "select"].includes(this.config_.type) && Array.isArray(options)) {
        // 下拉列表时，渲染下拉项
        if (this.config_.type === "select") {
          const { TagOption } = this.tags;
          return options.map((option, index) => (
            <TagOption
              {...{ props: option }}
              key={index}
              label={option[this.config_.optionLabel || "label"]}
              value={option[this.config_.optionValue || "value"]}
            ></TagOption>
          ));
        } else if (this.config_.type === "radio" || this.config_.type === "checkbox") {
          const tag = this.tags.prefix + this.config_.type;
          // 单选框、多选框
          return options.map((option, index) => (
            <tag props={{ ...option, label: option[this.config_.optionValue || "value"] }} key={index}>
              {option[this.config_.optionLabel || "label"]}
            </tag>
          ));
        }
      }
      return [];
    },
  },
  render() {
    if (!this.isShow) {
      return;
    }
    // 按钮等其他元素的渲染。 无prop属性名
    if (this.config_.render && !this.config_.prop) {
      let vnode = this.config_.render(h, this.value, this.onInput) as VNode;
      return vnode;
    }

    // 渲染vnode
    let vnode: VNode | Element;
    // 将base基础的属性放入公共对象。因为子组件可能没有定义prop而直接取attr的时候。先将这些属性同时复制到attr和prop
    let baseAttrs = {
      size: this.rootConfig.size,
      disabled: this.rootConfig.disabled,
      clearable: this.rootConfig.clearable,
      placeholder: this.config_.placeholder,
    };

    if (this.config_.prop && this.config_.render) {
      // 有prop属性名和render同时存在的时候。render作为输入元素
      vnode = this.config_.render(h, this.value, this.onInput) as VNode;
      // 绑定value和input事件
      if (vnode.componentOptions) {
        // props的合并
        vnode.componentOptions = merge<VNodeComponentOptions>(
          {
            // webpack 的 merge 会合并 2个 方法 同时执行
            listeners: { input: this.onInput },
            propsData: {
              ...baseAttrs,
              labelWidth: this.config_.labelWidth,
              ...(this.config_?.nodeData?.props || {}),
              ...(this.config_?.props || {}),
              value: this.value,
            },
          },
          vnode.componentOptions || {}
        );
        if (this.options.length) {
          vnode.componentOptions.propsData["options"] = this.options;
        }
      }
      // attrs 的合并
      vnode.data = merge(
        {
          attrs: {
            ...baseAttrs,
            ...(this.config_?.nodeData?.attrs || {}),
            ...(this.config_?.attrs || {}),
          },
        },
        vnode.data || {}
      );
    } else {
      // /* 一些基础类型的配置
      //   tag：标签名
      //   VNodeData: 渲染函数具体数据对象，参考vue文档 https://cn.vuejs.org/v2/guide/render-function.html
      //   children: 渲染的下级内容
      // */

      const defaultAttrs: VNodeData = {
        props: {
          value: this.value,
          ...baseAttrs,
        },
        attrs: {
          placeholder: this.config_.placeholder,
        },
        on: {
          input: this.onInput,
        },
      };
      const nodeData: VNodeData = merge(defaultAttrs, this.config_.nodeData, {
        props: this.config_.props || {},
        attrs: this.config_.attrs || {},
      });

      const Tag = this.config_.tag || this.tags.prefix + this.config_.type;
      vnode = <Tag {...nodeData}>{this.renderChildren(h)}</Tag>;
    }

    const { TagFormItem } = this.tags;
    return (
      <div
        style={{ width: this.config_.itemBoxWidth }}
        class={[
          this.config_.className,
          {
            "ml-form-item-box": true,
            "hide-round": this.config_.hideRound,
            hide: !this.isShow,
          },
        ]}
      >
        <TagFormItem
          class={{
            "ml-form-item": true,
            ["ml-form-" + this.config_.type]: true,
            "ml-form-item-block": this.config_.block,
            // 'is-not-value': this.isNotValue
          }}
          ref="formItem"
          rules={this.config_.rules}
          style={{ width: this.config_.itemWidth, maxWidth: this.config_.itemMaxWidth }}
          label={this.config_.label}
          prop={this.config_.prop}
          labelWidth={this.config_.labelWidth}
        >
          {vnode}
        </TagFormItem>
      </div>
    );
  },
});
