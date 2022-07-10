/**
 * 线状图,下面有区域颜色
 */
import BaseEcharts from "..";
import Vue from "vue";

export default Vue.extend({
  name: "MlEchartsLineArea",
  mixins: [BaseEcharts],
  props: { seriesLength: { default: 1 }, chartOptions: {} },
  methods: {
    setOption(this: any) {
      let option: any = {};
      if (this.seriesLength > 0) {
        option.series = [];
        for (let i = 0; i < this.seriesLength; i++) {
          option.series.push({
            type: "line",
            areaStyle: {
              color: {
                type: "liner",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: this.defaultOption.color[i] + "ff", // 0% 处的颜色
                  },
                  {
                    offset: 0.1,
                    color: this.defaultOption.color[i] + "66", // 10% 处的颜色
                  },
                  {
                    offset: 1,
                    color: this.defaultOption.color[i] + "00", // 100% 处的颜色
                  },
                ],
              },
            },
          });
        }
      }
      if (this.seriesLength === 1) {
        option.legend = { show: false };
        option.grid = { bottom: 30 };
      }
      const mergeOption = this.merge(this.defaultOption, this.option, option);
      this.chart.setOption(mergeOption);
    },
  },
});
