import cloneDeep from "lodash-es/cloneDeep";
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean },
    clearable: { type: Boolean },
    readonly: { type: Boolean },

    value: { type: [String, Number, Object, Array] },
  },
  setup({ value }) {
    const val = ref(value);
    function emitVal() {}
    function setVal() {
      val.value = cloneDeep(value);
    }
  },
});
