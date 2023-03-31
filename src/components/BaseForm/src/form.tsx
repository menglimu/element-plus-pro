/**
 * 表单组件
 * done 多个联动组件的demo
 * done 一个组件输出多个值的时候的处理
 * done 组件rootValue是否拷贝
 * fail 自定义组件内进行校验
 * done 自定义组件内进行初始化
 *
 *
 *
 */
import { nextTick, onMounted, provide, ref, watchEffect } from "vue";
// import FormItem from "./formItem";
import { cloneDeep } from "lodash";

import "./form.scss";
import { ElForm, FormInstance, FormProps } from "element-plus";
import FormItem, { BaseFormColumn, BaseFormItemExpose } from "./FormItem";
import { UseModelEmits, UseModelProps, useModel } from "../hooks/useModel";
import { emitFormValueKey, emitItemInitValueKey, formConfigKey, formValueKey } from "../keys";

// 将elform所有属性放在config中而不是直接在prop中。主要是为了方便监听elformProp中的项。防止触发太频繁
// 其他方案，考虑通过toRefs将所有props进行转换

/** 表单的配置项,D为输出的data对象的类型 */
export interface BaseFormConfig<D = AnyObj> extends UnReadonly<Partial<FormProps>> {
  /** 具体表单项的配置 */
  columns: Array<BaseFormColumn<D>>;
  /** 是否显示清除按钮 */
  clearable?: boolean;
  /** 是否只读 */
  readonly?: boolean;
}

export interface BaseFormProps<D = AnyObj> extends UseModelProps<D> {
  config: BaseFormConfig<D>;
}

export interface BaseFormExpose extends FormInstance {
  /** 重置初始值 */
  reset(): void;
  /** 重新刷新options name 为需要刷新的那项 key 或者 prop */
  reloadOptions(name: string): void;
}

// elform 的 默认值,
const elformDefault = {
  inline: true,
  clearable: true,
  labelWidth: "100px",
  labelSuffix: ":",
};

export default FC<BaseFormProps, BaseFormExpose, UseModelEmits>({
  name: "BaseForm",
  inheritAttrs: false,
  props: ["config", "modelValue"],
  setup(props, { expose, emit }) {
    const elForm = ref<FormInstance>();
    const { value, emitValue } = useModel(props, emit);
    const value_ = $(value);

    // 初始值。初始化时候的值，columns 改变的时候，会重置该值
    let initValue = $ref<AnyObj>({});

    const refs: { [k in string]: BaseFormItemExpose | null } = {};

    let config_ = $shallowRef<BaseFormConfig>();
    let elformProps = $ref<Partial<FormProps>>();
    // 初始化值
    watchEffect(() => {
      config_ = Object.assign({}, elformDefault, props.config);
      const { clearable, readonly, columns, ...other } = config_;
      elformProps = other;
    });

    // 根据key设置表单的初始值
    function emitFormDefaultValue(value: any, prop: string) {
      prop && (initValue[prop] = value);
    }
    watchEffect(() => {
      emitValue({ ...initValue, ...value_ });
    });

    provide(formValueKey, $$(value_!));
    provide(emitFormValueKey, emitFormValue);
    provide(emitItemInitValueKey, emitFormDefaultValue);
    provide(formConfigKey, $$(config_));

    onMounted(() => {
      // 重写form的 resetFields
      expose({ reset, ...elForm.value!, resetFields: reset, reloadOptions });
    });
    // reloadOptions 使用场景不多 先注释掉
    function reloadOptions(name: string) {
      refs?.[name]?.relaodOptions?.();
    }

    // 重置初始值
    function reset() {
      emitValue(cloneDeep(initValue));
      clearValidate();
    }

    // 使用change的时候。需要将清除延后
    async function clearValidate(props?: string | string[]) {
      await nextTick();
      elForm.value?.clearValidate(props);
    }

    // 监听值改变设置某一项value_的值
    function emitFormValue(value?: any, prop?: string) {
      if (!prop || !value_) return;
      value_[prop] = value;
      emitValue(value_);
    }

    return () => (
      <ElForm ref={elForm} {...elformProps} class={["ml-form"]} model={value_}>
        {props.config?.columns.map((item) => {
          return (
            <FormItem
              configItem={item}
              // reloadOptions 使用场景不多 先注释掉
              // ref={(el: any) => {
              //   refs[item.prop || index] = el;
              // }}
            />
          );
        })}
      </ElForm>
    );
  },
});
