import { getIcon } from "@/utils";
import { ButtonProps, ElButton } from "element-plus";
import { VNodeChild } from "vue";

/**
 * @Author: wenlin
 * @Description: 按钮组
 */
export interface ButtonGroupProps {
  btns?: GroupButton[];
}
export interface GroupButton extends Partial<ButtonProps> {
  /** 按钮内的文字 */
  name?: string;
  /** svg图标，参考svg-icon的实现。 el- 开头表示 element的图标  */
  icon?: string;

  /** 与 innerBtn不同，只能使用函数返回true/false */
  hideJudge?: () => boolean;
  /** 点击的回调函数，可以不通过事件监听的方式 */
  callback?: () => void | Promise<void>;
  /** 自定义按钮或其他的 */
  render?: () => VNodeChild;
}

export default FC<ButtonGroupProps>({
  name: "ButtonGroup",
  props: ["btns"],
  setup(props) {
    return () => {
      if (!props.btns?.length) return;
      return (
        <div>
          {props.btns?.map((btn) => {
            if (btn.render) return btn.render();
            return (
              <ElButton v-show={btn.hideJudge ? !btn.hideJudge() : true} class="outerBtn" type="primary" plain {...btn} onClick={() => btn?.callback?.()}>
                {getIcon(btn.icon)}
                {btn.name}
              </ElButton>
            );
          })}
        </div>
      );
    };
  },
});
