/**
 * 表单组件
 *
 */
import Vue, { defineComponent, PropType } from "vue";
import Tags from "../../../utils/tags";
import FormItem from "./formItem";
import { cloneDeep, isEqual } from "lodash";
import { MlFormConfig, MlFormColumn, MlFormDefaultOptions } from "types/form";
import { ElForm } from "element-ui/types/form";
import merge from "@/utils/merge";
import "./form.scss";

import { setComponentsPreset } from "./config";
// import style from 'index.module.scss'

export default defineComponent({
  name: "MlForm",
  props: {
    value: { type: null, default: null },
    /** 表单配置项 */
    config: { type: Object as PropType<MlFormConfig>, required: true },
  },
  data() {
    return {
      initValue: {}, // 初始值
      config_: null as MlFormConfig, // form的配置项
      value_: {}, // form的值
      tags: null as Tags,
      defaultOptions: null as MlFormDefaultOptions, // 一些默认值的配置。可通过use的时候进行修改
      framework: "element-ui", // ui框架类型
      componentsPreset: {},
      // config 默认值
      configDefault: {
        inline: true,
        labelWidth: "100px",
        // uiType: 'round',
        clearable: true,
        "label-suffix": "：",
        // size: "small",
      },
    };
  },
  created() {
    this.initDefault();
    this.$watch("config", this.onConfigChange, { deep: true, immediate: true });
    this.$watch("value", this.onParentValueChange, { deep: true });
  },
  mounted() {
    // 对于form里表单的属性采用代理引入。避免重复引用
    for (const key in this.$refs.form) {
      if (this.$refs.form.hasOwnProperty(key) && key in this === false) {
        Object.defineProperty(this, key, {
          get: () => {
            return this.$refs.form[key];
          },
        });
      }
    }
    this.autoSize();
  },
  methods: {
    onConfigChange() {
      this.config_ = this.getConfig_();
      this.init();
    },
    onParentValueChange(value: AnyObj) {
      let val = value;
      if (this.config_?.format?.toEleValue) {
        val = this.config_.format.toEleValue(value);
      }
      if (isEqual(val, this.value_)) return;
      this.value_ = val;
    },
    // 自动size相关
    // TODO: 自动设置 没个元素的默认宽度 itemBoxWidth
    autoSize() {
      // 自适应form的size
      let timer: number;
      if (this.config_.autoSize) {
        this.getSize();
        window.onresize = () => {
          if (timer) {
            clearTimeout(timer);
          }
          timer = window.setTimeout(this.getSize, 200);
        };
      }
    },
    getSize() {
      const Width =
        window.innerWidth || // 浏览器窗口的内部宽度（包括滚动条）
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (Width < 1366) {
        // this.size = 'mini'
        this.$set(this.config_, "size", "mini");
      } else if (Width < 1600) {
        // this.size = 'small'
        this.$set(this.config_, "size", "small");
      } else if (Width < 1680) {
        // this.size = 'medium'
        this.$set(this.config_, "size", "medium");
      }
    },

    // use时的初始值的处理
    initDefault() {
      this.defaultOptions = (this as any).MlForm;
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
      setComponentsPreset(this.tags.prefix, this.componentsPreset);
    },

    // 初始化值
    init() {
      let value = this.value;
      if (this.config_?.format?.toEleValue) {
        value = this.config_.format.toEleValue(value);
      }
      const defaultValue = this.getDefaultValue();
      this.value_ = { ...defaultValue, ...value };
      this.initValue = defaultValue;
      this.emitValue();
    },

    // 重新加载options
    reloadOptions(name: string) {
      (this.$refs?.[name] as any)?.onOptionsGetChange?.();
    },

    // 合并表单配置项， 通过 Object.assign 简写初始化
    getConfig_() {
      const config = merge<MlFormConfig>(
        this.configDefault,
        {
          // autoSize: this.config.size ? false : true,
          labelPosition: this.config.uiType === "round" ? "center" : "right",
        },
        this.config
      );
      if (!config.inline) {
        config.itemMaxWidth = "inherit";
      }
      if (this.config_?.autoSize && this.config_?.size) {
        config.size = this.config_.size;
      }
      return config;
    },

    // 重置初始值
    reset() {
      this.$emit("input", cloneDeep(this.initValue));
      this.clearValidate();
    },
    // 验证数据 使用表单默认的验证

    // 重写form的 resetFields
    resetFields() {
      this.reset();
    },

    // 使用change的时候。需要将清除延后
    clearValidate(props?: string | string[]) {
      this.$nextTick(() => {
        (this.$refs.form as ElForm)?.clearValidate(props);
      });
    },

    emitValue() {
      let value_ = this.value_;
      // !!! 此处可能会改变value的引用。可能会引起值整体的变化。性能问题?
      if (this.config_?.format?.toValue) {
        value_ = this.config_.format.toValue(this.value_);
      }
      if (isEqual(this.value, value_)) return;
      this.$emit("input", value_);
    },
    // 监听值改变设置某一项value_的值
    onInput(prop: string, value: any) {
      if (!prop) return;
      this.$set(this.value_, prop, value);
      this.emitValue();
    },

    // 获取选项默认值
    getDefaultValue(): any {
      // const list = this.config_.columns.filter(item => item.type !== 'special')
      const defaultValue = {};
      this.config_.columns.forEach((column) => {
        if (column.prop) {
          defaultValue[column.prop] = this.getValByType(column);
        }
      });
      return cloneDeep(defaultValue);
    },
    // 注释掉一些初始值的处理。代码尽量简洁
    getValByType(column: MlFormColumn) {
      if (column.hasOwnProperty("value")) {
        return column.value;
      }
      return null;
    },
  },
  render() {
    // eslint-disable-next-line
    const { uiType, columns, format, ...formAttrs } = this.config_;
    const { TagForm } = this.tags;
    return (
      // 通过解构。将所有用户属性解构到form中
      <TagForm
        ref="form"
        // attrs={formAttrs}
        props={{ model: this.value_, ...formAttrs }}
        class={[uiType, this.config_.size, "label-" + this.config_.labelPosition, "ml-form"]}
      >
        {columns.map((item, index) => {
          return (
            <FormItem
              tags={this.tags}
              key={item.key || item.prop || index}
              ref={item.key || item.prop}
              configItem={item}
              originalValue={this.value_[item.prop]}
              rootValue={this.value_}
              rootConfig={this.config_}
              onInput={(value: any) => this.onInput(item.prop, value)}
              // onHide={this.onHide}
              // onShow={(e: object) => this.onShow(item, e)}
            />
          );
        })}
        {this.$slots.default}
      </TagForm>
    );
  },
});
