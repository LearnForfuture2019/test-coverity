// require("asset-require-hook")({
//     extensions: ["svg", "css", "less", "jpg", "png", "gif"],
//     name: '/static/media/[name].[ext]'
// });
// require("babel-core/register")();
// require("babel-polyfill");
// require("./app");
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
require('ignore-styles');
require('@babel/register')({
    ignore:[/(node_modules)/],
    presets:['@babel/preset-env', '@babel/preset-react']
})
require('./app')
