/*
 * @Author: wenlin
 * @Date: 2020-02-25 10:25:33
 * @LastEditors: wenlin
 * @LastEditTime: 2020-12-28 11:36:43
 * @Description:  只保留form中的公共方法
 */
import { getJudge, isNull } from "@/utils";
import { MlOptions } from "types/common";
import { MlTableColumn, MlTableConfig } from "types/table";
import { CreateElement } from "vue/types/umd";

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
  cellValue: string | number | Array<string | number>,
  config: MlOptions & { type?: string }
): string | number {
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
  preList: string | [string],
  column?: { baseUrl?: string; noPre?: boolean },
  className?: string,
  h?: CreateElement
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

interface RowParams<D> {
  row: any;
  column: MlTableColumn<D>;
}

function getStatusNames(className: string[], statusJudge: AnyObj, row: AnyObj) {
  if (typeof statusJudge === "function") {
    return statusJudge(row);
  }
  if (statusJudge) {
    Object.keys(statusJudge).map((status) => getJudge(statusJudge[status], row) && className.push(status));
  }
  return className;
}

function getBaseRender<D>(column: MlTableColumn<D>) {
  if (column.type === "image") {
    return (h: CreateElement, params: RowParams<D>) => {
      let preList = params.row[column.prop];
      const className = getStatusNames(["td-img-box"], column.statusJudge, params.row);

      if (preList) {
        return getImage(preList, column, className, h);
      } else {
        return <span></span>;
      }
    };
  } else if (column.type === "svg") {
    return (h: CreateElement, params: RowParams<D>) => {
      if (params.row[column.prop]) {
        const className = getStatusNames(["td-svg-box"], column.statusJudge, params.row);
        return (
          <div class={className}>
            <svg-icon class="td-svg" icon-class={params.row[column.prop]} />
          </div>
        );
      } else {
        return <span></span>;
      }
    };
  } else {
    return (h: CreateElement, params: RowParams<D>) => {
      const className = getStatusNames(["td-text"], column.statusJudge, params.row);

      if (column.formatter) {
        return <div class={className}>{column.formatter(params.row, column as any)}</div>;
      }
      return (
        <span class={className} domPropsInnerHTML={formatterFormValue(params.row[column.prop], params.column)}></span>
      );
    };
  }
}

export function columnsHandler(config: MlTableConfig<any, any>) {
  config.columns.forEach((column) => {
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
