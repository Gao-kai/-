module.exports = {
    configureWebpack:{
        output:{
            libraryTarget:'umd', // 指定打包后产物的规范为umd 可多端加载
            library:'singleSpaVue', // 指定打包后产物挂载到全局变量window上或者通过import导入时的名称
            globalObject:"this"
        },
        devServer:{
            port:9999
        }
        
    }
}