// 服务端代码打包webpack的配置文件
//引入核心path模块
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const serverConfig = {
    target: 'node', //告诉webpack，打包的是服务器端的代码
    mode:'development',//表示打包用于的环境
    entry:'./src/server/index.js', //入口文件
    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname,'build')
    },//打包文件所处目录
    externals:[nodeExternals()], //避免打包node_modules中的代码module:{
    //配置规则
    module:{
        rules:[
            {
                test:/\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['react', 'stage-0', ['env', {
                        targets:{
                            browsers: ['last 2 versions'] //表示打包过程中，webpack会去兼容所有浏览器最新的两个版本
                        }
                    }]]
                }
            },
            {
                test: /\.css?$/,
                use:[
                    'isomorphic-style-loader',
                    {
                        loader:'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[name]_[local]_[hash:base64:5]'
                            },
                        }
                    }
                ]
            }
        ]
    }

}


module.exports = serverConfig
