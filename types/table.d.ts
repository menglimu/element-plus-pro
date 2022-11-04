import { ButtonProps, PaginationProps } from "element-plus";
import { TableProps } from "element-plus/es/components/table/src/table/defaults";
import { TableColumnCtx } from "element-plus/lib/components/table/src/table-column/defaults";
import { VNode } from "vue";
import { MlFormConfig } from "./form";
interface TableSearchProp<D = AnyObj> {
  /** 搜索和重置按钮在输入项后显示，！输入项不能占满元素 默认 false */
  isBtnInForm?: boolean;

  /** 超过一行隐藏。不传会根据config中的column的长度判断，长度大于3的时候开启 */
  isOverHide?: boolean;

  /** 从第几个开始隐藏。默认会根据 表单的长度进行处理。有不属于表单标准长度的自行传入 */
  hideIndex?: number;

  /** 展开状态下。默认会根据 表单的长度进行处理。按钮是否是独自一行。该状态会增加bottom间距，在label在top时，单独显示隐藏掉btn的top间距。 */
  aloneLineBtn?: boolean;

  /** 表单的初始值，重置会使该值对象下的搜索项还原为默认值 */
  initialValue?: AnyObj;

  /** 搜索表单配置 */
  config?: MlFormConfig<D>;
}

interface MlTableConfig<D = AnyObj> extends Partial<TableProps<D>> {
  /** 多选，默认false */
  selection?: boolean;

  /** 多选时候，分页，保存选择状态 */
  reserveSelection?: boolean;

  /** 序号 默认false */
  index?: boolean;

  /** 表格操作宽度 */
  tableOptWidth?: string;

  /** 表格的具体项 */
  columns: Array<MlTableColumn<D>>;
}
interface TableParams {
  pageSize?: number;
  pageNum?: number;
  sortColumn?: string;
  sortAsc?: boolean;
  // [P in keyof S]?: S[P]
}
interface RowParams<D = AnyObj> {
  row: D;
  column: MlTableColumn<D>;
  $index: number;
}
/** 分页相关配置。其他配置内容可参考 分页组件参数 */

interface TableButton extends Partial<ButtonProps> {
  /** 按钮内的文字 */
  name?: string;

  /** 触发的事件类型 */
  evtType?: "mldelete";

  /** svg图标，参考svg-icon的实现。 el- 开头表示 element的图标  */
  icon?: string;

  render?: (scoped?: any) => VNode;
}

/** 表格内按钮配置。其他配置内容可参考 按钮组件参数 */
interface MlTableInnerBtn<D = AnyObj> extends TableButton {
  /** 点击的回调函数，可以不通过事件监听的方式 */
  callback?: (row: D) => void;

  /** 可使用函数返回true/false，判断显示，参数为行数据，使用对象的时候，对象内的每个属性和行数据相等时可用 */
  showJudge?: AnyObj | ((row: D) => boolean); // {status: 1,title: '123'}
}

/** 表格外按钮配置 */
interface MlTableOuterBtn<D = AnyObj> extends TableButton {
  /** false   不选,(其他值)， 单选，多选， */
  selection?: "none" | "single" | "multiple" | "";

  /** 与 innerBtn不同，只能使用函数返回true/false */
  showJudge?: (data: D[]) => boolean;

  /** 点击的回调函数，可以不通过事件监听的方式 */
  callback?: (rows: D[]) => void | Promise<any>;
}

type MlTableType = "" | "string" | "image" | "svg" | "select" | "index" | "selection";

/** 表格的具体项配置，更多内容可参考 UI框架中的表格组件 */
interface MlTableColumn<D = AnyObj> extends MlOptions, Partial<TableColumnCtx<D>> {
  /** 表格中的类型包括 */
  type?: MlTableType;

  /** tableColumn的key，默认使用prop，存在相同prop时，传入key */
  key?: string;

  /** 是否显示列 默认 true */
  showJudge?: boolean | (() => boolean);

  /** 状态处理。对象内分别为状态名和满足的条件
   * success: 绿色，error：红色，warning：橙色，done：蓝色，failed：灰色
   */
  statusJudge?:
    | (AnyObj & {
        success?: AnyObj;
        error?: AnyObj;
        warning?: AnyObj;
        done?: AnyObj;
        failed?: AnyObj;
      })
    | ((data: D) => string | "success" | "error" | "warning" | "done" | "failed");

  /** 图片的时候，是否使用预览 */
  noPre?: boolean;

  /** 自定义表格内容的展示 */
  render?: (params: RowParams<D>) => VNode;
  /** 自定义整列内容，应返回<el-table-column></c-table-column> */
  renderColumn?: () => VNode;
}
interface ResponseData<D = AnyObj> {
  total: number;
  content: D[];
}
interface BaseTableProps<D = AnyObj, S = AnyObj> {
  /** 表格头部搜索项 */
  searchConfig?: TableSearchProp<D>;

  /** 搜索表单附加值，会被输入框中的值覆盖 */
  params?: AnyObj;

  /** 初始化的时候，是否直接请求数据，默认 true */
  initSearch?: boolean;

  /** 请求的接口列表 */
  api?: {
    /**
     * 删除接口，evtType为mldelete时触发内部删除并使用该方法
     * @param {String} ids id拼接的字符串
     * @param {Array} data 要删除的数据列表
     */
    delete?: (ids: string, data?: D[]) => Promise<any>;

    /** 查询列表数据 */
    list?: (data: S & TableParams) => Promise<ResponseData<D>>;

    /** 树形数据查询 */
    // tree?(
    //   data: S & TableParams
    // ): Promise<{
    //   content: D[]
    // }>

    /** 导入数据 */
    // import?: (data: S & TableParams) => Promise<any>;

    /** 导出数据 */
    // export?: (data: S & TableParams) => Promise<any>;
  };

  /** 表格配置项 */
  config: MlTableConfig<D>;

  /** 分页相关配置项 */
  paginationConfig?: Partial<PaginationProps> | false;

  /** 表格内按钮 */
  innerBtn?: MlTableInnerBtn<D>[];

  /** 表格外按钮 */
  outerBtn?: MlTableOuterBtn<D>[];

  /** 数据加载前的钩子函数，可处理请求参数，也可在api中的list方法中处理请求 */
  beforeGetList?: (type: string, params: S & TableParams) => AnyObj;
  /** 数据加载后的钩子函数 */
  afterGetList?: (type: string, res: ResponseData<D>) => void;
}
