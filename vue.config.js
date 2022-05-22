const webpack = require('webpack')
module.exports = {
	publicPath: './',
	outputDir: 'dist',
	assetsDir: 'static',
	// 关闭eslint语法检测
	lintOnSave: false,
	configureWebpack: {
		//支持jquery
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				'windows.jQuery': 'jquery'
			})
		]
	},
	// 开启代理服务器
	devServer: {
		proxy: {
			'/api': {
				// target: 'http://119.23.188.80:8848',
				target: 'http://localhost:8848',
				pathRewrite: { '^/api': '' }, //将请求头中的字符替换掉
				ws: true, //用于支持websocket
				changeOrigin: true //用于支持请求头中的host值
			}
		}
	}
}
