module.exports = {
    devServer:{
        port:10000,
        headers:{
            "Access-Control-Allow-Origin":"*"
        }
    },
    configureWebpack:{
        output:{
            library:"qiankunVue",
            libraryTarget:"umd"
        }
    }
}