/**
 * @Author: wenlin
 * @Description: 表单子组件
 */
interface ChildrenProps {}
export default FromFC<string, ChildrenProps>({
  name: "Children",
  props: [],
  setup(props, { emit }, { emitValue, value }) {
    return () => (
      <div class="Children">
        <el-input modelValue={props.modelValue} onInput={(val: string) => emit("update:modelValue", val)}></el-input>升{/* <el-input modelValue={value.value} onInput={emitValue}></el-input>升 */}
      </div>
    );
  },
});
