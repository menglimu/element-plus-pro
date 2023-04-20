/**
 * @Author: wenlin
 * @Description: 表单子组件
 */
interface ChildrenProps {}
export default FromFC<string, ChildrenProps>({
  name: "Children",
  props: [],
  setup(props, { emit }, { emitValue, value }) {
    // 下面2种方式都可以。emitValue为封装后的。会自动 深拷贝一次value.与原值解耦
    return () => (
      <div class="Children">
        {/* <el-input modelValue={value.value} onInput={emitValue}></el-input>升 */}
        <el-input modelValue={props.modelValue} onInput={(val: string) => emit("update:modelValue", val)}></el-input>升
      </div>
    );
  },
});
