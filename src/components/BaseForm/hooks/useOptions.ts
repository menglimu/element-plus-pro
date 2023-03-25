/**
 * done options 支持ref和普通数组
 */
import { isRef, Ref, ref, unref, watch, watchEffect, WatchStopHandle } from "vue";

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
  options?: Array<O> | Ref<Array<O>>;
  /** 异步获取的数据选项函数 */
  optionsGet?: () => Promise<{ content: O[] } | O[] | { data: O[] }>;
  /** label,value 等选项各字段对应的key的名字 */
  propNames?: PropNames;
}
/** 监听
 * TODO 简化逻辑写法
 */
export function useOptions<T extends UseOptionsProps>(props: T | Ref<T>, needTransName = true) {
  let options = ref<AnyObj[]>([]);
  if (isRef(props)) {
    let optionsWt: WatchStopHandle;
    let optionsGetWt: WatchStopHandle;
    watch(
      props,
      () => {
        optionsWt?.();
        optionsGetWt?.();
        props.value.options &&
          (optionsWt = watchEffect(() =>
            isRef(props.value.options) ? (options = props.value.options) : (options.value = props.value.options || [])
          ));
        props.value.optionsGet && (optionsGetWt = watchEffect(relaodOptions));
      },
      { immediate: true }
    );
  } else {
    watchEffect(() => (isRef(props.options) ? (options = props.options) : (options.value = props.options || [])));
    watchEffect(relaodOptions);
  }

  // watchEffect(() => {
  //   options.value = props.options || [];
  //   console.log(1234, options);
  // });

  async function relaodOptions() {
    const props_ = unref(props);
    console.log(48534);
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
