/**
 * 表单组件
 *
 */
import { WatchStopHandle, nextTick, onMounted, ref, watch, watchEffect } from "vue";
// import FormItem from "./formItem";
import { cloneDeep } from "lodash";

import merge from "@/utils/merge";
import "./form.scss";
import { ElForm, FormInstance, FormProps } from "element-plus";
import FormItem, { BaseFormColumn } from "./formItem";
import { useModel, UseModelEmits, UseModelProps } from "./utils";
import { ReactiveVariable } from "vue/macros";
// import style from 'index.module.scss'

/** 表单的配置项,D为输出的data对象的类型 */
export interface BaseFormConfig<D = AnyObj> extends UnReadonly<Partial<FormProps>> {
  /** 具体表单项的配置 */
  columns: Array<BaseFormColumn<D>>;
  /** 是否显示清除按钮 */
  clearable?: boolean;
  /** 自适应表单大小
   * @default false
   */
  // autoSize?: boolean;
}

export interface BaseFormProps<D = AnyObj> extends UseModelProps<D>, Partial<FormProps> {
  config: BaseFormConfig<D>;
}
export interface BaseFormExpose extends FormInstance {
  /** 重置初始值 */
  reset(): void;
  /** 重新刷新options name 为需要刷新的那项 key 或者 prop */
  reloadOptions(name: string): void;
}

export type BaseFormEmits = UseModelEmits<AnyObj>;

// config 默认值,
const configDefault = {
  inline: true,
  labelWidth: "100px",
  // uiType: 'round',
  clearable: true,
  "label-suffix": ":",
  // size: "small",
};
export default FC<BaseFormProps, BaseFormEmits, BaseFormExpose>({
  name: "BaseForm",
  inheritAttrs: false,
  props: ["config", "modelValue"],
  setup(props, { expose, emit }) {
    const elForm = ref<FormInstance>();

    const { value, emitValue } = useModel(props, emit);
    const value_ = $(value);
    // form的配置项
    let config_: BaseFormConfig = $ref({ columns: [] });
    // 初始值
    let initValue = {};

    // 初始化值
    watchEffect(() => Object.assign(config_, configDefault, props.config));
    watch(
      () => config_.columns,
      () => {
        console.log("columns change");
        initValue = getDefaultValue(config_);
        emitValue({ ...initValue, ...value_ });
      },
      { deep: true, immediate: true }
    );

    onMounted(() => {
      // 重写form的 resetFields
      expose({ reset, ...elForm.value!, resetFields: reset, reloadOptions });
    });

    // useAutoSize(config);

    // TODO 重新加载options
    function reloadOptions(name: string) {
      // ($refs?.[name] as any)?.onOptionsGetChange?.();
    }

    // 重置初始值
    function reset() {
      emitValue(cloneDeep(initValue));
      clearValidate();
    }
    // 验证数据 使用表单默认的验证

    // 使用change的时候。需要将清除延后
    async function clearValidate(props?: string | string[]) {
      await nextTick();
      elForm.value?.clearValidate(props);
    }

    // 监听值改变设置某一项value_的值
    function onItemInput(prop?: string, value?: any) {
      if (!prop || !value_) return;
      value_[prop] = value;
      emitValue(value_);
    }

    return () => {
      // 通过解构。将所有用户属性解构到form中
      const { columns, clearable, ...formProps } = config_;
      return (
        <ElForm
          ref={elForm}
          {...formProps}
          class={[config_.size, "label-" + config_.labelPosition, "ml-form"]}
          model={value_}
        >
          {columns.map((item, index) => {
            return (
              <FormItem
                key={item.key || item.prop || index}
                configItem={item}
                rootValue={value_!}
                rootConfig={config_}
                cbInput={onItemInput}
              />
            );
          })}
        </ElForm>
      );
    };
  },
});

// function useAutoSize(config: BaseFormConfig) {
//   onMounted(() => {
//     if (config.autoSize) {
//       getSize();
//       window.onresize = debounce(getSize, 200);
//     }
//   });

//   // 自动size相关
//   // TODO: 自动设置 个元素的默认宽度 itemBoxWidth

//   function getSize() {
//     const Width =
//       window.innerWidth || // 浏览器窗口的内部宽度（包括滚动条）
//       document.documentElement.clientWidth ||
//       document.body.clientWidth;
//     let size: "small" | "mini" | "medium" | "large" | undefined;
//     if (Width < 1366) {
//       size = "mini";
//     } else if (Width < 1600) {
//       size = "small";
//     } else if (Width < 1680) {
//       size = "medium";
//     }
//     config.size = size;
//   }
// }

// 获取选项默认值
function getDefaultValue(config: BaseFormConfig) {
  // const list = config_.columns.filter(item => item.type !== 'special')
  const defaultValue: AnyObj = {};
  config.columns.forEach((column) => {
    if (column.prop) {
      defaultValue[column.prop] = getValByType(column);
    }
  });
  // 注释掉一些初始值的处理。代码尽量简洁
  function getValByType(column: BaseFormColumn) {
    if (column.hasOwnProperty("value")) {
      return column.value;
    }
    return null;
  }
  return cloneDeep(defaultValue);
}
