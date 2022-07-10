/**
 * 单例全局组件挂载
 * 组件名命名规则: GlobalXXX
 */

import { VueConstructor } from "vue/types/umd";
import Component from "./src/index";

// 创建vue实例
const instance = new Component();

// 使用注册组件的方式
export default {
  install(Vue: VueConstructor) {
    // 在文档外进行挂载，将虚拟挂载的元素加载到body中
    document.body.appendChild(instance.$mount().$el);
    // 方法挂载到window还是vue上。待定
    Vue.prototype.$GlobalVideoPlayer = instance;
    return instance;
  },
};

// 使用方法的方式
// 在文档外进行挂载，将虚拟挂载的元素加载到body中

// document.body.appendChild(instance.$mount().$el);
// export default instance;
