import { CreateElement, VNode } from "vue/types/umd";
import { MlOptions } from "./common";
import { MlTableType } from "./table";

interface MlInfoProps<D = AnyObj> {
  /** 整体标题 */
  title?: string;
  /** 一个项的宽度 */
  width?: string;
  /** label的宽度 */
  labelWidth?: string;
  /** label后面的符号 */
  labelSuffix?: string;
  /** 回显的数据项 */
  columns: MlInfoColumn<D>[];
  /** 回显后台接口。会在初始化的时候请求数据 */
  request?: () => Promise<D>;
  /** 回显的数据 */
  data?: D;
}

interface MlInfoColumn<D = AnyObj> extends MlOptions {
  /** label名 */
  label?: string;
  /** 数据key名 */
  prop?: string;
  /** 数据项的总宽度 */
  width?: string;

  /** 数据的行数，默认一行。设置为0的时候，表示不限制行数 */
  rows?: number;

  /** 数据类型 */
  type?: MlTableType;

  /** label的长度 */
  labelWidth?: string;

  /** 图片相关 同表格的图片 */
  baseUrl?: string;
  noPre?: boolean;

  /** 数据项的类名 */
  className?: string;
  /** 格式处理函数 */
  formatter?: (value: string, data: D) => string | VNode | Element;
  /** 自定义显示 */
  render?: (h: CreateElement, value: string, data: D, item: MlInfoColumn<D>) => VNode | Element;
}
