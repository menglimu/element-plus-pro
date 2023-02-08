/*
 * @Author: wenlin
 * @Date: 2020-06-03 16:02:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-12-28 16:59:13
 * @Description:  获取表单子项的配置
 */

import { cloneDeep } from "lodash";
import merge from "@/utils/merge";
import { BaseFormColumn, BaseFormType } from "./formItem";
import { BaseFormConfig, BaseFormProps } from "./form";
import { FormItemRule } from "element-plus";
import { readonly } from "vue";

/**
 * @description:  // 一些类型的基本属性
 * {tag} 标签名
 * VNodeData: 渲染函数具体数据对象，参考vue文档 https://cn.vuejs.org/v2/guide/render-function.html
 * children: 渲染的下级内容
 *
 */

let componentsPreset: AnyObj = {
  input: {
    tag: "el-" + "input",
    props: {
      type: "text",
    },
  },
  textarea: {
    tag: "el-" + "input",
    props: {
      "text-input": true,
      type: "textarea",
      rows: 4,
    },
  },
  select: {
    tag: "el-" + "select",
    props: {
      "popper-append-to-body": true,
    },
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

// 设置组件内的默认属性
function getPreset(config: BaseFormColumn) {
  // 根据不同类型，匹配不同默认配置，多种类型共用一个配置的情况
  let defaultConfig: AnyObj = { nodeData: { props: {} } };

  // 没有类型时。默认为input输入框
  if (!(config.type || config.tag || config.render)) {
    defaultConfig = componentsPreset["input"];
  }

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
      defaultConfig.props["value-format"] = "HH:mm:ss";
      if (config.type === "timerange") {
        defaultConfig.props["is-range"] = true;
      }
    } else if (["date", "dates", "daterange"].includes(config.type)) {
      defaultConfig.props["value-format"] = "yyyy-MM-dd";
    } else if (["datetime", "datetimerange"].includes(config.type)) {
      defaultConfig.props["value-format"] = "yyyy-MM-dd HH:mm:ss";
    }
    if (["datetimerange"].includes(config.type)) {
      defaultConfig.props["default-time"] = ["00:00:00", "23:59:59"];
    }

    if (["datetimerange", "daterange"].includes(config.type)) {
      defaultConfig.props["range-separator"] = "至";
      defaultConfig.props["start-placeholder"] = "开始时间";
      defaultConfig.props["end-placeholder"] = "结束时间";
    }
  }
  return defaultConfig;
}
// 设置表单项的校验规则
function getRules(config: BaseFormColumn, prefix: string) {
  // 因为空校验和错误校验，UI颜色区别，所以要实时判空的原因，将所有的校验trigger修改为change
  let trigger: "blur" | "change" = "blur";
  if (prefix === "选择") {
    trigger = "change";
  }

  // 生成默认的一些校验规则
  const rules: Array<FormItemRule> = [];
  if (config.minlength !== undefined) {
    rules.push({
      pattern: new RegExp(`^(.|\n){${config.minlength},}$`),
      // min: config.minlength,
      message: `不能少于${config.minlength}个字`,
      trigger: trigger,
    });
  }
  if (config.maxlength !== undefined) {
    rules.push({
      pattern: new RegExp(`^(.|\n){0,${config.maxlength}}$`),
      // max: config.maxlength,
      message: `不能大于${config.maxlength}个字`,
      trigger: trigger,
    });
  }
  if (config.reg) {
    rules.push({
      pattern: new RegExp(config.reg), // /^\[\d+,\d+\]$/
      message: config.error || `${config.label}${prefix}有误`,
      trigger: trigger,
    });
  }
  if (config.required) {
    rules.push({
      required: true,
      message: config.error || `请${prefix}${config.label}`,
      trigger: trigger,
    });
  }
  if (rules.length > 0) {
    config.rules = Array.isArray(config.rules)
      ? config.rules.concat(rules)
      : config.rules
      ? [config.rules].concat(rules)
      : rules;
  }
}
// 获取基本配置
function getBaseConfig(config: BaseFormColumn, rootConfig: BaseFormConfig, prefix: string) {
  let config_: AnyObj = {
    itemMaxWidth: rootConfig.itemMaxWidth || "100%",
    show: true, // 初始化显示条件
  };
  // 初始化正则验证及提示
  if (config.label) {
    config_.placeholder = `请${prefix}${config.label}`;
  }

  let itemBoxWidth = "100%";
  if (rootConfig.inline) {
    itemBoxWidth = rootConfig.itemBoxWidth || "33.33%";
  }
  if (config.block) {
    itemBoxWidth = "100%";
  }
  config_.itemBoxWidth = itemBoxWidth;

  let itemWidth = "100%";
  if (!config.block) {
    itemWidth = rootConfig.itemWidth || "100%";
  }
  config_.itemWidth = itemWidth;
  return config_;
}

// 根据类型获取是输入还是选择的
function getPrefix(type?: BaseFormType) {
  let placeholderPrefix = "输入";

  if (
    type &&
    [
      "date",
      "dates",
      "daterange",
      "datetime",
      "datetimerange",
      "time",
      "timerange",
      "select",
      "tree",
      "cascader",
    ].includes(type)
  ) {
    placeholderPrefix = "选择";
  }
  return placeholderPrefix;
}
// 获取表单某项的配置
export function getFormColumn(mlFormColumn: BaseFormColumn, mlFormConfig: BaseFormConfig): BaseFormColumn {
  let config = cloneDeep(mlFormColumn);
  let prefix = getPrefix(config.type);
  // 获取基本配置
  let base = getBaseConfig(config, mlFormConfig, prefix);
  // 设置组件内的默认属性
  let preset = getPreset(config);
  // 通过config类型，初始化规则和匹配预设组件默认值
  getRules(config, prefix);
  return merge(base, preset, config);
}
