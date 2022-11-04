/**
 * 表单组件
 *
 */
import { defineComponent, nextTick, onMounted, PropType, reactive, Ref, ref, watch, watchEffect } from "vue";
// import FormItem from "./formItem";
import { cloneDeep, isEqual, debounce } from "lodash";
import { MlFormConfig, MlFormColumn, MlFormDefaultOptions } from "types/form";
import merge from "@/utils/merge";
import "./form.scss";
import { ElForm, FormInstance } from "element-plus";
// import style from 'index.module.scss'

// config 默认值,
const configDefault = {
  inline: true,
  labelWidth: "100px",
  // uiType: 'round',
  clearable: true,
  "label-suffix": "：",
  // size: "small",
};

interface IProps extends ModelProp<AnyObj> {
  config: MlFormConfig;
}
interface IExpose extends FormInstance {
  reset: () => void;
}
export default functionComponent<IProps, IExpose>(function MlForm(props, expose) {
  const { config, value, onInput } = $(props);

  // 初始值
  let initValue = {};
  // form的配置项
  let configNow = $ref<MlFormConfig>();
  // form的值
  let valueNow = $ref<AnyObj>({});

  const form = ref<FormInstance>();

  watch([config], init);

  useModel(props, $$(valueNow));

  onMounted(() => {
    // 重写form的 resetFields
    expose({ reset, ...form.value!, resetFields: reset });
  });

  // 初始化值
  function init() {
    configNow = getConfig();
    initValue = getDefaultValue(configNow);
    valueNow = { ...initValue, ...value };
  }

  // useAutoSize(config);

  // 重新加载options
  // function reloadOptions(name: string) {
  //   ($refs?.[name] as any)?.onOptionsGetChange?.();
  // }

  // 合并表单配置项， 通过 Object.assign 简写初始化
  function getConfig() {
    const config__ = merge(configDefault, config);
    if (!config__.inline) {
      config__.itemMaxWidth = "inherit";
    }
    return config__;
  }

  // 重置初始值
  function reset() {
    onInput?.(cloneDeep(initValue));
    clearValidate();
  }
  // 验证数据 使用表单默认的验证

  // 使用change的时候。需要将清除延后
  async function clearValidate(props?: string | string[]) {
    await nextTick();
    form.value?.clearValidate(props);
  }

  // 监听值改变设置某一项value_的值
  function onItemInput(prop?: string, value?: any) {
    if (!prop) return;
    valueNow[prop] = value;
  }

  return () => {
    // eslint-disable-next-line
    const { uiType, columns, format, ...formAttrs } = configNow;

    return (
      // 通过解构。将所有用户属性解构到form中
      <ElForm
        ref="form"
        // attrs={formAttrs}
        // {...{ model: value_, ...formAttrs }}
        class={[uiType, configNow.size, "label-" + configNow.labelPosition, "ml-form"]}
      >
        {columns.map((item, index) => {
          return (
            <div>1</div>
            // <FormItem
            //   key={item.key || item.prop || index}
            //   ref={item.key || item.prop}
            //   configItem={item}
            //   originalValue={value_[item.prop!]}
            //   rootValue={value_}
            //   rootConfig={config_}
            //   onInput={(value: any) => onItemInput(item.prop, value)}
            //   // onHide={onHide}
            //   // onShow={(e: object) => onShow(item, e)}
            // />
          );
        })}
        {slots.default}
      </ElForm>
    );
  };
});
// export default defineComponent({
//   name: "MlForm",
//   props: {
//     value: { type: null, default: () => ({}) },
//     /** 表单配置项 */
//     config: { type: Object as PropType<MlFormConfig>, required: true },
//   },
//   emits: { input: (value: AnyObj) => null },
//   setup(props, { emit, slots, expose }) {
//   },
// });
interface ModelProp<V = any> {
  value?: V;
  onInput?: (value: V) => void;
}
function useModel(props: ModelProp, valueNow: Ref<any>) {
  let $value = $ref(props.value);
  let $valueNow = $ref(valueNow);
  watch([props.value], setValue);
  watch([valueNow], emitValue);
  $valueNow = $value;

  function setValue() {
    if (isEqual($value, $valueNow)) return;
    $valueNow = $value;
  }
  function emitValue() {
    if (isEqual($value, $valueNow)) return;
    props.onInput?.($valueNow);
  }
  return { emitValue, setValue };
}

function useAutoSize(config: MlFormConfig) {
  onMounted(() => {
    if (config.autoSize) {
      getSize();
      window.onresize = debounce(getSize, 200);
    }
  });

  // 自动size相关
  // TODO: 自动设置 个元素的默认宽度 itemBoxWidth

  function getSize() {
    const Width =
      window.innerWidth || // 浏览器窗口的内部宽度（包括滚动条）
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    let size: "small" | "mini" | "medium" | "large" | undefined;
    if (Width < 1366) {
      size = "mini";
    } else if (Width < 1600) {
      size = "small";
    } else if (Width < 1680) {
      size = "medium";
    }
    config.size = size;
  }
}

// 获取选项默认值
function getDefaultValue(config: MlFormConfig) {
  // const list = config_.columns.filter(item => item.type !== 'special')
  const defaultValue: AnyObj = {};
  config.columns.forEach((column) => {
    if (column.prop) {
      defaultValue[column.prop] = getValByType(column);
    }
  });
  // 注释掉一些初始值的处理。代码尽量简洁
  function getValByType(column: MlFormColumn) {
    if (column.hasOwnProperty("value")) {
      return column.value;
    }
    return null;
  }
  return cloneDeep(defaultValue);
}
