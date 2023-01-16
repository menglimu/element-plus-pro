import { isEqual, cloneDeep } from "lodash";
import { ref, UnwrapNestedRefs, watch, watchEffect } from "vue";

export interface UseModelProps<V = unknown> {
  value?: V;
  // onInput?: (value: V) => void;
}
// emit使用interface 会出现类型不符。interface 往 Record 复制 报错
// export interface UseModelEmits<V = unknown> {
//   input: (value: V) => void;
// }
export type UseModelEmits<V = unknown> = {
  input: (value: V) => void;
};
/** 监听 props 中的value 返回 拷贝的prop中的value 和 触发事件的方法 */
export function useModel<T extends UseModelProps>(props: T, emit: Function) {
  let $value = $ref<T["value"]>(props.value);
  let value = ref<T["value"]>(cloneDeep(props.value));

  watch([props.value], setValue);

  function setValue() {
    if (isEqual($value, value.value)) return;
    value.value = $value;
  }
  function emitValue(val: T["value"]) {
    value.value = val;
    emit?.("input", cloneDeep(val));
  }
  return { emitValue, value };
}

/** 选项各字段对应的key的名字 */
interface PropNames {
  label?: string;
  value?: string;
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
export function useOptions<T extends UseOptionsProps>(props: UnwrapNestedRefs<T>, needTransName = true) {
  const options = ref(props.options || []);

  watch([props.options], () => (options.value = props.options || []));
  watch([props.optionsGet], onOptionsGetChange);

  async function onOptionsGetChange() {
    if (typeof props.optionsGet === "function") {
      const res = await props.optionsGet();
      if (Array.isArray(res)) {
        options.value = res;
      } else if ("content" in res && Array.isArray(res.content)) {
        options.value = res.content;
      } else if ("data" in res && Array.isArray(res.data)) {
        options.value = res.data;
      }
    }
  }
}
