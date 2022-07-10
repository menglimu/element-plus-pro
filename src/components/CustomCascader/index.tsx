/**
 * 自定义联级选择，主要修改了样式和单选的交互
 * 适用于选择一个项返回单个id的时候
 */

import Vue from "vue";
import "./index.scss";

export default Vue.extend({
  name: "MlCascader",
  props: {
    options: { type: Array, required: true },
    optionLabel: { type: String, default: "label" },
    optionValue: { type: String, default: "value" },
    value: { type: [String, Number], default: "" },
    props: { type: Object, default: () => ({}) },
  },
  computed: {
    propsObj(this: any) {
      return {
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false,
        value: this.optionValue,
        label: this.optionLabel,
        ...this.props,
      };
    },
  },
  methods: {
    computedProps() {
      return {
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false,
        value: this.optionValue,
        label: this.optionLabel,
        ...this.props,
      };
    },
    onClick(value) {
      // const value_ = this.value === value ? null : value
      this.$emit("input", value);
      const cascader: any = this.$refs.cascader;
      cascader.toggleDropDownVisible(false);
    },
    onInput(value) {
      this.$emit("input", value);
    },
  },
  render() {
    return (
      <el-cascader
        ref="cascader"
        class="custom-cascader"
        popper-class="custom-cascader-popper"
        value={this.value}
        onInput={this.onInput}
        options={this.options}
        props={{ ...this.$attrs, props: this.propsObj }}
        scopedSlots={{
          default: ({ data }) => (
            <div onClick={() => this.onClick(data[this.propsObj.value])}>{data[this.propsObj.label]}</div>
          ),
        }}
      ></el-cascader>
    );
  },
});
