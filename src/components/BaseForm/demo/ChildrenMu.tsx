/**
 * @Author: wenlin
 * @Description: 自定义组件： 多个输入项和值
 * 此处直接在 表单输出的 v-model 的对象上改，也可将值定义为 对象，使用2个key进行处理
 * 此处理出来 单独作为 组件时候的逻辑
 */
import { inject } from "vue";
import { emitFormInitValueKey, emitFormValueKey, formValueKey } from "../keys";
import { formItemContextKey } from "element-plus";

interface IProps {
  Unit?: string;
}
export default FromFC<unknown, IProps>({
  name: "Chilren",
  props: ["Unit"],
  setup(props, { emit }) {
    const formValue = $(inject(formValueKey)!);
    const formItemConfig = inject(formItemContextKey);

    const emitFormInitValue = inject(emitFormInitValueKey);
    const emitFormValue = inject(emitFormValueKey);
    console.log(formItemConfig);
    const valKey = formItemConfig?.prop as string;
    const unitKey = `${formItemConfig?.prop}Unit`;
    emitFormInitValue?.("中文", unitKey);

    const elItem = inject(formItemContextKey);
    setTimeout(() => {
      if (elItem) {
        elItem.validateState = "error";
        // elItem.validateStatus = "错误";
      }
    }, 10000);
    return () => (
      <div>
        <el-input modelValue={valKey ? formValue?.[valKey] : props.modelValue} onInput={(val: string) => emitFormValue?.(val, valKey)}></el-input>
        <el-select modelValue={formValue?.[unitKey]} class="m-2" placeholder="Select" size="large" onChange={(val: string) => emitFormValue?.(val, unitKey)}>
          {["中国", "日本", "美国"].map((item) => (
            <el-option key={item} label={item} value={item} />
          ))}
        </el-select>
      </div>
    );
  },
});
