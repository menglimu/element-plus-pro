import { isEqual, cloneDeep } from "lodash";
import { isRef, Ref, ref, unref, UnwrapNestedRefs, watch, watchEffect, WatchStopHandle } from "vue";
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

/** 选项各字段对应的key的名字 */
interface PropNames {
  label: string;
  value: string;
  children?: string;
  disabled?: string;
  isLeaf?: string;
}

export interface UseOptionsProps<O = AnyObj> {
  /** 下拉，单选多选等数据的选项 */
  options?: Array<O>;
  /** 异步获取的数据选项函数 */
  optionsGet?: () => Promise<{ content: O[] } | O[] | { data: O[] }>;
  /** label,value 等选项各字段对应的key的名字 */
  propNames?: PropNames;
}
/** 监听 */
export function useOptions<T extends UseOptionsProps>(props: T | Ref<T>, needTransName = true) {
  const options = ref<AnyObj[]>([]);
  if (isRef(props)) {
    let optionsWt: WatchStopHandle;
    let optionsGetWt: WatchStopHandle;
    watch(
      props,
      () => {
        optionsWt?.();
        optionsGetWt?.();
        props.value.options && (optionsWt = watchEffect(() => (options.value = props.value.options || [])));
        props.value.optionsGet && (optionsGetWt = watchEffect(relaodOptions));
      },
      { immediate: true }
    );
  } else {
    watchEffect(() => (options.value = props.options || []));
    watchEffect(relaodOptions);
  }

  // watchEffect(() => {
  //   options.value = props.options || [];
  //   console.log(1234, options);
  // });

  async function relaodOptions() {
    const props_ = unref(props);
    if (typeof props_.optionsGet === "function") {
      const res = await props_.optionsGet();
      let arry: AnyObj[] = [];
      if (Array.isArray(res)) {
        arry = res;
      } else if ("content" in res && Array.isArray(res.content)) {
        arry = res.content;
      } else if ("data" in res && Array.isArray(res.data)) {
        arry = res.data;
      }
      if (needTransName) {
        arry = trans(arry, props_.propNames);
      }
      options.value = arry;
    }
  }

  function trans(arry: AnyObj[], propNames?: PropNames) {
    if (Array.isArray(arry) && propNames) {
      arry.forEach((item) => {
        item.lable = item[propNames.label];
      });
    }
    return arry;
  }

  return { options, relaodOptions };
}
