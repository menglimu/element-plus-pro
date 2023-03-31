/**
 * @Author: wenlin
 * @Description: 表单demo
 */

import { ElButton, InputInstance } from "element-plus";
import BaseForm from "..";
import { BaseFormConfig, BaseFormExpose } from "../src/Form";
import Children from "./Children";
import { ref } from "vue";

interface IProps {}

export default FC<IProps>({
  name: "BaseFormDemo",
  props: [],
  setup(props) {
    let val = $ref({ b: [] });
    const aaa = ref([{ label: "1", value: "1" }]);
    const baseForm = ref<BaseFormExpose>();
    const formItem = ref();
    const children = ref();
    let a = 1;
    let formConfig: BaseFormConfig = $shallowRef({
      disabled: false,
      columns: [
        {
          label: "啊啊啊",
          prop: "a",
          value: 2,
          props: {
            ref: formItem,
            // ref: (el: any) => {
            //   console.log(el);
            //   formItem.value = el;
            // },
          },
          reg: /1234/,
          rules: [
            {
              validator(rule, value, callback, source, options) {
                console.log(source, "source");
                callback();
              },
            },
          ],
        },
        {
          label: "选择",
          prop: "select",
          type: "select",
          options: aaa,
          required(rootValue) {
            console.log(rootValue.a == "23");
            return rootValue.a == "23";
          },
          optionsGet: () => {
            console.log(1234);
            a++;
            return a === 3
              ? Promise.resolve([
                  { label: "1", value: "1" },
                  { label: "2", value: "2" },
                  { label: "3", value: "3" },
                ])
              : Promise.resolve([{ label: "1", value: "1" }]);
          },
        },
        { label: "自定义", prop: "aas", render: () => <Children ref={children} ref_for /> },
      ],
    });
    function cbOption() {
      console.log(formItem?.value, children?.value, formConfig.columns[0].props?.ref);
      baseForm.value?.reloadOptions("select");
      aaa.value.push({ label: "2", value: "2" });
      if (formConfig) {
        formConfig.columns.push({
          label: "选择2",
          prop: "select1111",
          type: "select",
          options: [{ label: "1", value: "1" }],
        });
      } else {
        formConfig = {
          disabled: false,
          columns: [
            { label: "啊啊啊", prop: "a" },
            { label: "选择", prop: "select", type: "select", options: [] },
          ],
        };
      }
    }
    return () => (
      <div>
        <BaseForm config={formConfig} v-model={val} ref={baseForm} />
        <ElButton onClick={cbOption}>改变options</ElButton>
        {JSON.stringify(val)}
      </div>
    );
  },
});
