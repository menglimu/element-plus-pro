import DPlayer from "dplayer";
import Vue from "vue";

/** 视频弹窗播放，依赖于dplayer */
export default Vue.extend({
  name: "MlDplayer",
  props: {
    // 传入一个字符串列表时。会按顺序挨个播放
    url: {
      type: null,
      default: "",
    },
  },
  data() {
    return {
      dp: null,
      playIndex: 0,
    };
  },

  mounted() {
    this.$nextTick(() => this.init());
  },

  methods: {
    pause() {
      this.playIndex = 0;
      if (this.dp) {
        this.dp.pause();
      }
    },
    init() {
      if (!this.url) {
        return;
      }
      this.dp = new DPlayer({
        container: this.$refs.container,
        theme: "#5289fc",
        autoplay: true,
        video: {
          url: Array.isArray(this.url) ? this.url[0] : this.url,
        },
        mutex: false, // 同时播放多个
      });
      // 播放结束后。继续播放列表中的下一个
      this.dp.on("ended", () => {
        if (Array.isArray(this.url) && this.url.length - 1 > this.playIndex) {
          this.dp.switchVideo({
            url: this.url[++this.playIndex],
          });
          this.dp.play();
        }
      });
    },
  },
  render() {
    return <div ref="container"></div>;
  },
});
