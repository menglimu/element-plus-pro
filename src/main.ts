import "@/utils/global";
import { createApp } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import App from "./App";

const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn,
});
app.mount("#app");
