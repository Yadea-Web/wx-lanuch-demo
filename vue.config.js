const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  pwa: {
    iconPaths: {
      favicon32: "favicon.ico",
      favicon16: "favicon.ico",
      appleTouchIcon: "favicon.ico",
      maskIcon: "favicon.ico",
      msTileImage: "favicon.ico",
    },
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [],
    },
  },
  publicPath: "/",
  outputDir: "dist",
  indexPath: "index.html",
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        options.compilerOptions = {
          ...options.compilerOptions,
          isCustomElement: (tag) => tag.startsWith("wx-open"),
        };
        return options;
      });

    //   删除默认配置中处理svg
    //   config.module.rules.delete('svg')
    //让默认的svg处理程序忽略此文件夹下面的svg文件
    config.module.rule("svg").exclude.add(resolve("src/assets/icons")).end();
    //svgo-loader是删除svg中的颜色，这样就可以用color重新设置
    config.module
      .rule("svg-sprite-loader")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end()
      .before("svg-sprite-loader")
      .use("svgo-loader")
      .loader("svgo-loader")
      .options({
        plugins: [
          //!!!!!!!!!!!!!!!重点就是改这个位置，加个插件名字
          {
            name: "removeAttrs",
            params: {
              attrs: "(fill|stroke)",
            },
          },
        ],
      })
      .end();
  },
};
