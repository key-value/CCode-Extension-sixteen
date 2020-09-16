const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

// Generate pages object
const pagesObj = {};

const chromeName = ["popup", "options"];

chromeName.forEach(name => {
  pagesObj[name] = {
    entry: `src/${name}/index.ts`,
    template: "public/index.html",
    filename: `${name}.html`
  };
});

const plugins =
  process.env.NODE_ENV === "production"
    ? [
        {
          from: path.resolve("src/manifest.production.json"),
          to: `${path.resolve("dist")}/manifest.json`
        }
      ]
    : [
        {
          from: path.resolve("src/manifest.development.json"),
          to: `${path.resolve("dist")}/manifest.json`
        }
      ];

// 开发环境将热加载文件复制到dist文件夹
if (process.env.NODE_ENV !== "production") {
  plugins.push(
    CopyWebpackPlugin([
      {
        from: path.resolve("src/utils/hot-reload.ts"),
        to: path.resolve("dist")
      }
    ])
  );
}

module.exports = {
  pages: pagesObj,
  // // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  configureWebpack: {
    entry: {
      content: "./src/content/index.ts"
    },
    output: {
      filename: "js/[name].js"
    },
    plugins: [CopyWebpackPlugin(plugins)]
  },
  css: {
    extract: {
      filename: "css/[name].css"
      // chunkFilename: 'css/[name].css'
    }
  },
  chainWebpack: config => {
    // 处理字体文件名，去除hash值
    const fontsRule = config.module.rule("fonts");

    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    fontsRule.uses.clear();
    fontsRule
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .use("url")
      .loader("url-loader")
      .options({
        limit: 1000,
        name: "fonts/[name].[ext]"
      });
    // 查看打包组件大小情况
    if (process.env.npm_config_report) {
      // 在运行命令中添加 --report参数运行， 如：npm run build --report
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
  }
};
