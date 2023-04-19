import { InjectionKey, Ref } from "vue";
import { BaseFormConfig } from "../src/Form";

export const formValueKey: InjectionKey<Ref<AnyObj>> = Symbol("formValueKey");
export const formConfigKey: InjectionKey<Ref<BaseFormConfig>> = Symbol("formConfigKey");

// 将表单项的初始值值提交给form
export const emitFormInitValueKey: InjectionKey<(value?: any, prop?: string) => void> = Symbol("emitFormValueKey");
// 将表单项的值提交给form, 一般使用 emit update:modelValue 来实现双向绑定即可
export const emitFormValueKey: InjectionKey<(value?: any, prop?: string) => void> = Symbol("emitFormValueKey");
