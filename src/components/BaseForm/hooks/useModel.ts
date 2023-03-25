import { cloneDeep, isEqual } from "lodash";
import { Ref, ref, watch } from "vue";
import { ReactiveVariable } from "vue/macros";

export interface UseModelProps<V = unknown> {
  modelValue?: V;
  // onInput?: (value: V) => void;
}
// emit使用interface 会出现类型不符。interface 往 Record 赋值 报错
// export interface UseModelEmits<V = unknown> {
//   input: (value: V) => void;
// }
export type UseModelEmits<V = unknown> = {
  "update:modelValue": (value: V) => void;
};
/** 监听 props 中的value 返回 拷贝的prop中的value 和 触发事件的方法 */
export function useModel<T extends UseModelProps>(
  props: ReactiveVariable<T>,
  emit: Function,
  onValueChange?: (value: T["modelValue"]) => void
) {
  let value: Ref<T["modelValue"]> = ref(cloneDeep(props.modelValue));
  watch(
    () => props.modelValue,
    () => {
      if (isEqual(props.modelValue, value.value)) return;
      value.value = cloneDeep(props.modelValue);
      onValueChange?.(value.value);
    }
  );
  function emitValue(val: T["modelValue"]) {
    value.value = val;
    emit?.("update:modelValue", cloneDeep(val));
  }
  return { emitValue, value };
}
