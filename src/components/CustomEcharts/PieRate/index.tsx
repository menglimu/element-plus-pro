/**
 * 圆环，中间百分比
 */

import BaseEcharts from "..";
import Vue from "vue";

export default Vue.extend({
  name: "MlEchartsPieRate",
  mixins: [BaseEcharts],
  props: {
    rate: { default: 0 },
    color: { default: "#5289fc" },
    option: { default: () => ({}) },
  },
  watch: {
    rate: {
      deep: true,
      handler(this: any) {
        this.$nextTick(this.setOption);
      },
    },
  },
  methods: {
    setOption(this: any) {
      let option = {
        legend: { show: false },
        tooltip: { show: false },
        xAxis: { show: false },
        yAxis: { show: false },
        title: {
          // text: `${self.ringData}%`,
          text: `${this.rate}%`,
          // subtext: '%',
          left: "center",
          top: "center", // top待调整
          textStyle: {
            color: "#fff",
            fontSize: 20,
            fontFamily: "DigifaceWide",
          },
          subtextStyle: {
            color: "#ff",
            fontSize: 12,
            fontFamily: "PingFangSC-Regular",
            top: "center",
          },
          itemGap: -4, // 主副标题间距
        },
        series: [
          {
            type: "pie",
            radius: ["80%", "100%"],
            legendHoverLink: false,
            labelLine: { show: false },
            emphasis: { scale: false },
            avoidLabelOverlap: false,
            data: [
              { name: "rate", value: this.rate, itemStyle: { color: this.color } },
              { name: "all", value: 100 - this.rate, itemStyle: { color: "rgba(82,137,252,0.1)" } },
            ],
          },
        ],
      };
      const mergeOption = this.merge(this.defaultOption, this.option, option);
      this.chart.setOption(mergeOption);
    },
  },
});
