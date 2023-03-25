import { FormFcProps } from "@/utils/global";

interface TreeProps extends FormFcProps {}

export default FromFC<TreeProps>({
  setup(props, ctx, { value, emitValue }) {
    return <div></div>;
  },
});
