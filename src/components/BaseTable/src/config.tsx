/*
 * @Author: wenlin
 * @Date: 2020-02-25 10:25:33
 * @LastEditors: wenlin
 * @LastEditTime: 2020-12-28 11:36:43
 * @Description:  只保留form中的公共方法
 */
import { getJudge, isNull } from "@/utils";
import { BaseTableProps, MlTableColumn, MlTableConfig } from "types/table";
import { watch } from "vue";

// 获取树形的值
function getTreeLabel(
  id: string | number,
  options: any[] = [],
  { optionLabel = "label", optionValue = "value", optionChildren = "children" } = {}
): string {
  let result;
  for (const item of options) {
    if (item[optionValue] === id) {
      result = item[optionLabel];
      break;
    } else if (item[optionChildren]) {
      result = getTreeLabel(id, item[optionChildren], { optionLabel, optionValue, optionChildren });
      if (result) break;
    }
  }
  return result;
}

/**
 * @description: 将存的值转换为文本
 * @param {cellValue} 待转换的值
 * @param {config} 当前column的配置
 * @return: 转换后的文本，可能含有标签的字符串
 */
export function formatterFormValue<D>(
  cellValue: string | Array<string | number>,
  config: MlOptions & { type?: string }
): string {
  let label = cellValue;
  if (config.type === "select") {
    const valueArr = Array.isArray(cellValue) ? cellValue : [cellValue];
    label = valueArr.map((id) => getTreeLabel(id, config.options, config)).filter((label) => !isNull(label));
  }
  return Array.isArray(label) ? label.join(",") : label;
}
/**
 * 获取图片的render
 * @param preList 图片链接地址
 * @param column 配置项
 * @param className 类名
 * @returns
 */
// eslint-disable-next-line max-params
export function getImage(
  preList: string | string[],
  column: { baseUrl?: string; noPre?: boolean },
  className?: string | string[]
) {
  let preList_: string[];
  if (!Array.isArray(preList)) {
    preList_ = [preList];
  } else {
    preList_ = preList;
  }

  if (column.baseUrl) {
    preList_ = preList_.map((url: string) => column.baseUrl + url);
  }
  return (
    <div class={className}>
      {preList_.map((item: string) => {
        if (column.noPre) {
          return <img class="td-img" src={item} />;
        } else {
          return <el-image class="td-img" fit="cover" src={item} preview-src-list={preList_} />;
        }
      })}
    </div>
  );
}

/**
 * @description: 获取各类型的默认render来自定义表格显示内容
 * @param {column} 配置项
 * @return:
 */

function getStatusNames(
  className: string[],
  statusJudge: InferArray<BaseTableProps["config"]["columns"]>["statusJudge"],
  row: AnyObj
) {
  if (!statusJudge) return className;
  if (typeof statusJudge === "function") {
    return statusJudge(row);
  }
  if (statusJudge) {
    Object.keys(statusJudge).map((status) => getJudge(statusJudge[status], row) && className.push(status));
  }
  return className;
}

function getBaseRender(column: MlTableColumn): InferArray<BaseTableProps["config"]["columns"]>["render"] {
  if (column.prop === undefined) return;
  if (column.type === "image") {
    return (params) => {
      let preList = params.row[column.prop!];
      const className = getStatusNames(["td-img-box"], column.statusJudge, params.row);

      if (preList) {
        return getImage(preList, column, className);
      } else {
        return <span></span>;
      }
    };
  } else if (column.type === "svg") {
    return (params) => {
      if (params.row[column.prop!]) {
        const className = getStatusNames(["td-svg-box"], column.statusJudge, params.row);
        return (
          <div class={className}>
            <svg-icon class="td-svg" icon-class={params.row[column.prop!]} />
          </div>
        );
      } else {
        return <span></span>;
      }
    };
  } else {
    return (params) => {
      const className = getStatusNames(["td-text"], column.statusJudge, params.row);

      if (column.formatter) {
        return (
          <div class={className}>
            {column.formatter(params.row, column as any, params.row[params.column.prop!], params.$index)}
          </div>
        );
      }
      return <span class={className} innerHTML={formatterFormValue(params.row[column.prop!], params.column)}></span>;
    };
  }
}

function handleConfig(props: BaseTableProps) {
  const columns = props.config.columns;
  columns.forEach((column) => {
    if (typeof column.optionsGet === "function") {
      column.options = [];
      column.optionsGet().then((res) => {
        if (Array.isArray(res)) {
          column.options = res;
        }
        if ("content" in res && Array.isArray(res.content)) {
          column.options = res.content;
        }
      });
    }
    if (!column.render) {
      column.render = getBaseRender(column);
    }
  });
}

export default function useConfig(props: BaseTableProps) {
  watch([props.config], () => handleConfig(props), { immediate: true });

  return props.config;
}
