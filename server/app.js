import App from '../src/App';
import express from 'express'
import React from 'react';
import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server';

// 配置文件
const config = {
    port: 3040
};

// 实例化 express
const app = new express();

//使用中间件
app.use(express.static(path.join(__dirname,'../build')));

app.get('*', (req, res) => {
    //从build文件夹读取编译后的html文件
    fs.readFile(path.resolve('./build/index.html'),'utf-8',(err, data)=>{
        if (err){
            console.log(err)
            return res.status(500).send('some errors happened')
        }
        console.log(data);
        //成功读取到数据
        res.send(data.replace('<div id="root"></div>',`
            <div id="root">${renderToString(<App/>)}</div>
        `))
    })
})

app.listen(config.port, function() {
    console.log('服务器启动，监听 port： ' + config.port + '  running~');
});
