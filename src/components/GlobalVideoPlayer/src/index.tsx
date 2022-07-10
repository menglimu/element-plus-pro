/**
 * 右侧视频播放弹窗
 * TODO: 添加播放视频流。对象。判断重复
 */
import Vue from "vue";
import Dplayer from "@/components/CustomDplayer";
import "./index.scss";

export default Vue.extend({
  name: "GlobalVideoPlayer",
  data() {
    return {
      urls: [],
    };
  },
  methods: {
    // 添加到播放列表
    push(url: string | string[]) {
      if (this.urls.length >= 4) {
        this.urls.shift();
      }
      this.urls.push(url);
    },
    // 从播放列表删除
    remove(index) {
      this.urls.splice(index, 1);
    },
  },
  render() {
    return (
      <div class="global-video-player">
        {this.urls.map((item, index) => (
          <div class="player-box">
            <Dplayer url={item}></Dplayer>
            <button class="el-dialog__headerbtn" circle onClick={() => this.remove(index)}>
              <i class="el-icon-close"></i>
            </button>
          </div>
        ))}
      </div>
    );
  },
});
