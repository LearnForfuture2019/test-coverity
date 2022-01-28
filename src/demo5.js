import React, {useState, useEffect} from "react";
const obserFunc = (str,callback)=>{
    const cb = (callback) =>{
        return '123'
    }
    window.addEventListener(str,cb)
    return window.removeEventListener(str,cb)
}
function Demo5() {
    const [count, setCount] = useState(0)
    const handleTest = () => {
        console.log('this is a test')
    }

    useEffect(() => {
        //自定义函数造成内存泄露，未卸载
        obserFunc('test', handleTest())
    })
    return (
        <div>test</div>
    )
}
