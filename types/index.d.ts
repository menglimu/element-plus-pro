import Vue from "vue";
import { MlForm } from "./form";
import { MlTable } from "./table";

interface MlComponents {
  install: (vue: typeof Vue, options: AnyObj) => void;
  MlForm: MlForm;
  MlTable: MlTable;
  // MlEcharts,
  // MlEchartsLineArea,
  // MlEchartsPieRate,
  // MlCascader
}

export const mlComponents: MlComponents;
export default mlComponents;
