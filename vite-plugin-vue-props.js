import transProps from "./props";
// const fileRegex = /global\.(ts)$/;
const fileRegex = /\.(tsx)$/;

export default function myPlugin() {
  return {
    name: "transform-file",
    enforce: "pre",
    transform(src, id) {
      if (fileRegex.test(id) && src.includes("$FC")) {
        const res = transProps(src, id);
        return {
          code: res.code,
          map: res.map, // 如果可行将提供 source map
        };
      }
    },
  };
}
