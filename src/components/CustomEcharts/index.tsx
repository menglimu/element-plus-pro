/**
 * 基础EChart组件
 */

import * as echarts from "echarts";

import resize from "./mixins/resize";
import merge from "@/utils/merge";
import style from "./index.module.scss";
import { ECharts } from "echarts";

export default resize.extend({
  name: "MlEcharts",
  mixins: [resize],
  props: {
    option: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      chart: null as ECharts,
      defaultOption: {
        color: ["#009dff", "#11c372", "#ffa542", "#ff4f5c"],
        title: {
          textStyle: {
            color: "#ffffff",
            fontSize: 14,
            fontWeight: "normal",
          },
          textAlign: "left",
        },
        legend: {
          textStyle: {
            color: "rgba(255,255,255,0.65)",
          },
          bottom: 10,
          left: 45,
        },
        tooltip: {},
        grid: {
          right: 24,
          left: 50,
          top: 40,
        },
        xAxis: {
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#cccccc",
            },
          },
        },
        yAxis: {
          axisLabel: {
            color: "rgba(255,255,255,0.65)",
          },
          splitLine: {
            lineStyle: {
              color: ["#d7d7d7"],
              type: "dashed",
            },
          },
        },
      },
    };
  },
  created() {
    this.$watch("option.series", this.refresh, { deep: true });
    this.$watch("option.xAxis", this.refresh, { deep: true });
    this.$watch("option.dataset", this.refresh, { deep: true });
  },
  mounted() {
    if (this.option) {
      this.initChart();
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    // 初始化
    initChart() {
      this.chart = echarts.init(this.$el as HTMLElement);
      this.setOption();
    },
    // 数据更改后的刷新
    refresh() {
      this.$nextTick(this.setOption);
    },
    // 设置echart的option
    setOption() {
      const mergeOption = merge(this.defaultOption, this.option);
      this.chart.setOption(mergeOption);
    },
  },
  render() {
    return <div class={style.charts}></div>;
  },
});
