import { cloneDeep } from "lodash";
import merge from "@/utils/merge";
import { BaseFormColumn } from "./FormItem";
import { FormItemRule } from "element-plus";

export type BaseFormType = "text" | "textarea" | "select" | "radio" | "checkbox" | "date" | "dates" | "daterange" | "time" | "timerange" | "datetime" | "datetimerange" | "color" | "cascader";

let componentsPreset: AnyObj = {
  text: {
    type: "text",
    tag: "el-" + "input",
    props: { type: "text" },
  },
  textarea: {
    tag: "el-" + "input",
    props: { textInput: true, type: "textarea", rows: 4 },
  },
  select: {
    tag: "el-" + "select",
    props: { popperAppendToBody: true },
  },
  radio: {
    tag: "el-" + "radio-group",
  },
  checkbox: {
    tag: "el-" + "checkbox-group",
  },
  date: {
    tag: "el-" + "date-picker",
  },
  time: {
    tag: "el-" + "time-picker",
  },
};

// 获取表单每一项的默认值
// TODO 根据类型为每项设置初始值
// TODO 根据columns生成D的定义
export function getValByType(column: BaseFormColumn) {
  if (column.hasOwnProperty("value")) {
    return cloneDeep(column.value);
  }
}

// 设置组件内的默认属性
function getPreset(config: BaseFormColumn) {
  // 根据不同类型，匹配不同默认配置，多种类型共用一个配置的情况
  let defaultConfig: BaseFormColumn = { props: {} };

  // 没有类型时。默认为input输入框
  if (!(config.type || config.tag || config.render)) {
    defaultConfig = componentsPreset["text"];
  }
  defaultConfig.props = defaultConfig.props || {};

  if (config.type) {
    if (["date", "dates", "daterange", "datetime", "datetimerange"].includes(config.type)) {
      defaultConfig = componentsPreset[config.type] || componentsPreset["date"];
      defaultConfig.props = { type: config.type };
    } else if (["time", "timerange"].includes(config.type)) {
      defaultConfig = componentsPreset[config.type] || componentsPreset["time"];
      defaultConfig.props = { type: config.type };
    } else {
      defaultConfig = componentsPreset[config.type] || {};
    }

    // 时间，日期的数据初始化
    if (["time", "timerange"].includes(config.type)) {
      defaultConfig.props!["value-format"] = "HH:mm:ss";
      if (config.type === "timerange") {
        defaultConfig.props!["is-range"] = true;
      }
    } else if (["date", "dates", "daterange"].includes(config.type)) {
      defaultConfig.props!["value-format"] = "yyyy-MM-dd";
    } else if (["datetime", "datetimerange"].includes(config.type)) {
      defaultConfig.props!["value-format"] = "yyyy-MM-dd HH:mm:ss";
    }
    if (["datetimerange"].includes(config.type)) {
      defaultConfig.props!["default-time"] = ["00:00:00", "23:59:59"];
    }

    if (["datetimerange", "daterange"].includes(config.type)) {
      defaultConfig.props!["range-separator"] = "至";
      defaultConfig.props!["start-placeholder"] = "开始时间";
      defaultConfig.props!["end-placeholder"] = "结束时间";
    }
  }
  return defaultConfig;
}
// 设置表单项的校验规则
function getRules(config: BaseFormColumn) {
  // 因为空校验和错误校验，UI颜色区别，所以要实时判空的原因，将所有的校验trigger修改为change
  const prefix = getPrefix(config.type);
  let trigger = getTrigger(prefix);

  // 生成默认的一些校验规则
  const rules: Array<FormItemRule> = [];
  if (config.props?.minlength !== undefined) {
    rules.push({
      pattern: new RegExp(`^(.|\n){${config.props.minlength},}$`),
      // min: config.minlength,
      message: `不能少于${config.props.minlength}个字`,
      trigger: trigger,
    });
  }
  if (config.props?.maxlength !== undefined) {
    rules.push({
      pattern: new RegExp(`^(.|\n){0,${config.props.maxlength}}$`),
      // max: config.maxlength,
      message: `不能大于${config.props.maxlength}个字`,
      trigger: trigger,
    });
  }
  if (config.reg) {
    rules.push({
      pattern: new RegExp(config.reg), // /^\[\d+,\d+\]$/
      message: `${config.label}${prefix}有误`,
      trigger: trigger,
    });
  }
  return config.rules ? rules.concat(config.rules) : rules;
}

// 根据类型获取是输入还是选择的
export function getPrefix(type?: BaseFormType) {
  let placeholderPrefix = "输入";

  if (type && ["date", "dates", "daterange", "datetime", "datetimerange", "time", "timerange", "select", "tree", "cascader"].includes(type)) {
    placeholderPrefix = "选择";
  }
  return placeholderPrefix;
}
export function getTrigger(prefix: string) {
  return "change";
}
// 获取表单某项的配置
export function getFormColumn(config: BaseFormColumn): BaseFormColumn {
  // 设置组件内的默认属性
  let base: BaseFormColumn = getPreset(config);
  // 初始化正则验证及提示
  if (config.label) {
    const prefix = getPrefix(config.type);
    base.placeholder = `请${prefix}${config.label}`;
  }
  const config_ = merge(base, config);
  // 通过config类型，初始化规则和匹配预设组件默认值
  config_.rules = getRules(config);
  return config_;
}

// 根据表单的配置项，获取当前表单的默认值
// export function getDefaultValue(columns: Array<BaseFormColumn>) {
//   // const list = config_.columns.filter(item => item.type !== 'special')
//   const defaultValue: AnyObj = {};
//   columns?.forEach((column) => {
//     if (column.prop) {
//       const val = getValByType(column);
//       if (val !== undefined) {
//         defaultValue[column.prop] = val;
//       }
//     }
//   });
//   return cloneDeep(defaultValue);
// }
