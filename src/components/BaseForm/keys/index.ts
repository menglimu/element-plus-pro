import { InjectionKey, Ref } from "vue";
import { BaseFormConfig } from "../src/form";
import { BaseFormColumn } from "../src/formItem";

export const formValueKey: InjectionKey<Ref<AnyObj>> = Symbol("formValueKey");
export const formConfigKey: InjectionKey<Ref<BaseFormConfig>> = Symbol("formConfigKey");
export const formItemConfigKey: InjectionKey<Ref<BaseFormColumn>> = Symbol("formItemConfigKey");
export const emitFormValueKey: InjectionKey<(value?: any, prop?: string) => void> = Symbol("emitFormValueKey");
// 自定义form组件的时候，可以使用为其设置默认值
export const emitFormItemInitValueKey: InjectionKey<(value: any, prop?: string) => void> = Symbol("emitFormValueKey");

// 将表单项的值提交给form, 给formItem提供。 需要提交默认值是，使用上面的 emitFormItemInitValueKey
export const emitItemInitValueKey: InjectionKey<(value?: any, prop?: string) => void> = Symbol("emitFormValueKey");
