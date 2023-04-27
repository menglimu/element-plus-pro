/**
 * 表格搜索
 * TODO: 切换隐藏时的动画
 */
import { Ref, UnwrapNestedRefs, ref, watch } from "vue";
import { FetchListFn } from "../../src";
import { BaseFormExpose, BaseFormProps } from "@/components/BaseForm/src/Form";
import BaseForm from "@/components/BaseForm";
import { ElButton, ElLink } from "element-plus";
import { cloneDeep } from "lodash";
import { DArrowRight } from "@element-plus/icons-vue";
import { UseModelEmits } from "@/components/BaseForm/hooks/useModel";

export interface BaseTableSearchProps<D extends AnyObj = AnyObj> extends BaseFormProps<D> {
  // 点击搜索和重置后调用的方法
  search?: FetchListFn;
  // 从第几个开始隐藏。默认会根据 表单的长度进行处理。有不属于表单标准长度的自行传入
  hideIndex?: number;
  // 是否超过一行隐藏
  isOverHide?: boolean;
  // 表单的初始值。会被重置为默认值
  initValue?: AnyObj;
}
interface IExpose<D extends AnyObj = AnyObj> {
  onSearch: () => Promise<void>;
  onReset: () => Promise<void>;
  baseForm: Ref<BaseFormExpose | undefined>;
  value: Ref<D>;
}
export type BaseTableSearchExpose<D extends AnyObj = AnyObj> = UnwrapNestedRefs<IExpose<D>>;

export default FC<BaseTableSearchProps, IExpose>({
  name: "TableSearch",
  props: ["search", "hideIndex", "isOverHide", "initValue", "config"],
  setup(props, { expose, attrs }) {
    const baseForm = ref<BaseFormExpose>();
    let value = $ref({});
    let showMore = $ref(false);

    watch(
      () => props.initValue,
      () => (value = cloneDeep(props.initValue) || {}),
      {
        immediate: true,
      }
    );

    expose({ onSearch, onReset, baseForm, value: $$(value) });

    const hideIndex = $computed(() => Math.round(100 / parseFloat(props.config.width || "25%")) + 1);
    const isOverHide = $computed(() => {
      const is = props.isOverHide !== undefined ? props.isOverHide : props.config?.columns?.length > hideIndex ? true : false;
      if (!is) showMore = true;
      return is;
    });

    function onChangeHideStatus() {
      showMore = !showMore;
    }

    function onSubmit(e: Event) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    function onKeyup(e: KeyboardEvent) {
      if (e.key === "Enter") {
        onSearch();
      }
    }

    async function onSearch() {
      // 存在搜索项，先校验表单加载完全和表单验证
      await baseForm?.value?.validate();
      await props?.search?.("search", value);
    }

    async function onReset() {
      baseForm?.value?.reset();
    }

    return () => (
      <div class={{ tableSearch: true, hide: !showMore }}>
        <div onKeyup={onKeyup} onSubmit={onSubmit} class="formBox">
          <BaseForm ref={baseForm} config={props.config} v-model={value} {...attrs} />
        </div>
        <div class="btnBox">
          {isOverHide && (
            <ElLink onClick={onChangeHideStatus} type="primary" underline={false} class="more">
              {showMore ? "收起查询条件" : "更多查询条件"}
              <el-icon class={showMore ? "fold" : ""}>
                <DArrowRight />
              </el-icon>
            </ElLink>
          )}
          <div class="btns">
            <ElButton onClick={onSearch} type="primary">
              查询
            </ElButton>
            <ElButton onClick={onReset} type="primary" plain>
              重置
            </ElButton>
          </div>
        </div>
      </div>
    );
  },
});
