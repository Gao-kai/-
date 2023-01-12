module.exports = {
  webpack: (config) => {
    config.output.library = `qiankunReact`;
    config.output.libraryTarget = "umd";

    return config;
  },
  devServer: (configFunction)=>{
    return function(proxy,allowedHost){
      const config = configFunction(proxy,allowedHost);
      // 添加允许跨域访问
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      console.log(config)
      config.port = 20000;
      // 最后将配置返回
      return config;
    }
  }
};
