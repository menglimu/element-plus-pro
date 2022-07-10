/**
 * 表单组件
 *
 */
import Vue, { defineComponent, onMounted, PropType, reactive, ref, watch, watchEffect } from "vue";
import FormItem from "./formItem";
import { cloneDeep, isEqual } from "lodash";
import { MlFormConfig, MlFormColumn, MlFormDefaultOptions } from "types/form";
import merge from "@/utils/merge";
import "./form.scss";
import { setComponentsPreset } from "./config";
import { FormInstance } from "element-plus";
// import style from 'index.module.scss'
export default defineComponent({
  props: {
    value: { type: null, default: null },
    /** 表单配置项 */
    config: { type: Object as PropType<MlFormConfig>, required: true },
  },
  setup() {
    reactive({
      initValue: {}, // 初始值
      config_: null as MlFormConfig, // form的配置项
      value_: {}, // form的值
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
    });

    const form = ref<FormInstance>();

    initDefault();
    watch([config], onConfigChange);
    watchEffect(value, onParentValueChange);

    onMounted(() => {
      // 对于form里表单的属性采用代理引入。避免重复引用
      // for (const key in form) {
      //   if (form.hasOwnProperty(key) && key in this === false) {
      //     Object.defineProperty(this, key, {
      //       get: () => {
      //         return $refs.form[key];
      //       },
      //     });
      //   }
      // }
      autoSize();
    });

    function onConfigChange() {
      config_ = getConfig_();
      init();
    }
    function onParentValueChange(value: AnyObj) {
      let val = value;
      if (config_?.format?.toEleValue) {
        val = config_.format.toEleValue(value);
      }
      if (isEqual(val, value_)) return;
      value_ = val;
    }
    // 自动size相关
    // TODO: 自动设置 没个元素的默认宽度 itemBoxWidth
    function autoSize() {
      // 自适应form的size
      let timer: number;
      if (config_.autoSize) {
        getSize();
        window.onresize = () => {
          if (timer) {
            clearTimeout(timer);
          }
          timer = window.setTimeout(getSize, 200);
        };
      }
    }
    function getSize() {
      const Width =
        window.innerWidth || // 浏览器窗口的内部宽度（包括滚动条）
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (Width < 1366) {
        // size = 'mini'
        $set(config_, "size", "mini");
      } else if (Width < 1600) {
        // size = 'small'
        $set(config_, "size", "small");
      } else if (Width < 1680) {
        // size = 'medium'
        $set(config_, "size", "medium");
      }
    }

    // use时的初始值的处理
    function initDefault() {
      defaultOptions = (this as any).MlForm;
      if (defaultOptions) {
        for (const key in defaultOptions) {
          if (typeof defaultOptions[key] === "object") {
            this[key] = merge(this[key], defaultOptions[key]);
          } else {
            this[key] = defaultOptions[key];
          }
        }
      }
      tags = new Tags(framework);
      setComponentsPreset(tags.prefix, componentsPreset);
    }

    // 初始化值
    function init() {
      let value = value;
      if (config_?.format?.toEleValue) {
        value = config_.format.toEleValue(value);
      }
      const defaultValue = getDefaultValue();
      value_ = { ...defaultValue, ...value };
      initValue = defaultValue;
      emitValue();
    }

    // 重新加载options
    function reloadOptions(name: string) {
      ($refs?.[name] as any)?.onOptionsGetChange?.();
    }

    // 合并表单配置项， 通过 Object.assign 简写初始化
    function getConfig_() {
      const config = merge<MlFormConfig>(
        configDefault,
        {
          // autoSize: config.size ? false : true,
          labelPosition: config.uiType === "round" ? "center" : "right",
        },
        config
      );
      if (!config.inline) {
        config.itemMaxWidth = "inherit";
      }
      if (config_?.autoSize && config_?.size) {
        config.size = config_.size;
      }
      return config;
    }

    // 重置初始值
    function reset() {
      $emit("input", cloneDeep(initValue));
      clearValidate();
    }
    // 验证数据 使用表单默认的验证

    // 重写form的 resetFields
    function resetFields() {
      reset();
    }

    // 使用change的时候。需要将清除延后
    function clearValidate(props?: string | string[]) {
      $nextTick(() => {
        ($refs.form as ElForm)?.clearValidate(props);
      });
    }

    function emitValue() {
      let value_ = value_;
      // !!! 此处可能会改变value的引用。可能会引起值整体的变化。性能问题?
      if (config_?.format?.toValue) {
        value_ = config_.format.toValue(value_);
      }
      if (isEqual(value, value_)) return;
      $emit("input", value_);
    }
    // 监听值改变设置某一项value_的值
    function onInput(prop: string, value: any) {
      if (!prop) return;
      $set(value_, prop, value);
      emitValue();
    }

    // 获取选项默认值
    function getDefaultValue(): any {
      // const list = config_.columns.filter(item => item.type !== 'special')
      const defaultValue = {};
      config_.columns.forEach((column) => {
        if (column.prop) {
          defaultValue[column.prop] = getValByType(column);
        }
      });
      return cloneDeep(defaultValue);
    }
    // 注释掉一些初始值的处理。代码尽量简洁
    function getValByType(column: MlFormColumn) {
      if (column.hasOwnProperty("value")) {
        return column.value;
      }
      return null;
    }

    return () => {
      // eslint-disable-next-line
      const { uiType, columns, format, ...formAttrs } = config_;
      const { TagForm } = tags;
      return (
        // 通过解构。将所有用户属性解构到form中
        <TagForm
          ref="form"
          // attrs={formAttrs}
          props={{ model: value_, ...formAttrs }}
          class={[uiType, config_.size, "label-" + config_.labelPosition, "ml-form"]}
        >
          {columns.map((item, index) => {
            return (
              <FormItem
                tags={tags}
                key={item.key || item.prop || index}
                ref={item.key || item.prop}
                configItem={item}
                originalValue={value_[item.prop]}
                rootValue={value_}
                rootConfig={config_}
                onInput={(value: any) => onInput(item.prop, value)}
                // onHide={onHide}
                // onShow={(e: object) => onShow(item, e)}
              />
            );
          })}
          {$slots.default}
        </TagForm>
      );
    };
  },
});
