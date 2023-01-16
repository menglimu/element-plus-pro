/**
 * 表单组件
 *
 */
import { nextTick, onMounted, ref, watchEffect } from "vue";
// import FormItem from "./formItem";
import { cloneDeep } from "lodash";

import merge from "@/utils/merge";
import "./form.scss";
import { ElForm, FormInstance, FormProps } from "element-plus";
import FormItem, { BaseFormColumn } from "./formItem";
import { useModel, UseModelEmits, UseModelProps } from "./utils";
// import style from 'index.module.scss'

/** 表单的配置项,D为输出的data对象的类型 */
export interface BaseFormConfig<D = AnyObj> extends FormProps {
  /** 具体表单项的配置 */
  columns: Array<BaseFormColumn<D>>;
  /** 是否显示清除按钮 */
  clearable?: boolean;
  // /** 每个输入项的长度，
  //  * @default  33.33%, block 默认100%
  //  */
  // itemBoxWidth?: string; // 输入项宽度
  // /** 输入项内容的长度
  //  * @default 100%
  //  */
  // itemWidth?: string;
  // /** 输入项内容的最大长度
  //  * @default 100%
  //  */
  // itemMaxWidth?: string;
  /** 自适应表单大小
   * @default false
   */
  // autoSize?: boolean;
}

export interface BaseFormProps<D = AnyObj> extends UseModelProps<D> {
  config: BaseFormConfig<D>;
}

// interface IEmits extends UseModelEmits<AnyObj> {
//   a: () => void;
// }
export type BaseFormEmits = UseModelEmits<AnyObj>;

export interface BaseFormExpose extends FormInstance {
  /** 重置初始值 */
  reset(): void;
  /** 重新刷新options name 为需要刷新的那项 key 或者 prop */
  reloadOptions(name: string): void;
}

// config 默认值,
const configDefault = {
  inline: true,
  labelWidth: "100px",
  // uiType: 'round',
  clearable: true,
  "label-suffix": "：",
  // size: "small",
};
export default FC<BaseFormProps, BaseFormEmits, BaseFormExpose>({
  name: "BaseForm",
  props: ["config", "value"],
  setup(props, { expose, emit }) {
    const { config } = $(props);
    const { value, emitValue } = useModel(props, emit);
    // form的配置项
    let config_ = $ref<BaseFormConfig>();
    // 初始值
    let initValue = {};
    const elForm = ref<FormInstance>();

    // 初始化值
    watchEffect(() => {
      config_ = merge(configDefault, config);
      initValue = getDefaultValue(config_);
      emitValue({ ...initValue, ...value });
    });

    onMounted(() => {
      // 重写form的 resetFields
      expose({ reset, ...elForm.value!, resetFields: reset, reloadOptions });
    });

    // useAutoSize(config);

    // 重新加载options
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
      if (!prop) return;
      value.value[prop] = value;
      emitValue(value.value);
    }

    return () => {
      // eslint-disable-next-line
      const { columns, clearable, ...formAttrs } = config_;

      return (
        // 通过解构。将所有用户属性解构到form中
        <ElForm
          ref="form"
          // attrs={formAttrs}
          // {...{ model: value_, ...formAttrs }}
          class={[config_.size, "label-" + config_.labelPosition, "ml-form"]}
          model={value}
          labelSuffix="11"
        >
          {columns.map((item, index) => {
            return (
              <FormItem
                key={item.key || item.prop || index}
                // ref={item.key || item.prop}
                configItem={item}
                rootValue={value.value}
                rootConfig={config_}
                onInput={(value: any) => onItemInput(item.prop, value)}
              />
            );
          })}
          {/* {slots.default} */}
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
