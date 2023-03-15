// import VueMacros from "unplugin-vue-macros/vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import props from "./vite-plugin-vue-props";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    vueJsx({}),
    // props(),
  ],
  resolve: {
    alias: { "@": "/src/" },
  },
});
