import React, {useState, useEffect} from "react";
const obserFunc = (str,callback)=>{
    const cb = (callback) =>{
        return '123'
    }
    window.addEventListener(str,cb)
    return window.removeEventListener(str,cb)
}
function Demo3() {
    const [count, setCount] = useState(0)
    const handleTest = () => {
        console.log('this is a test')
    }
    const clearData = () =>　{
        window.removeEventListener('test',() => {
            console.log('test')
        })
        document.removeEventListener('test2',handleTest)
    }
    useEffect(() => {
        window.addEventListener('test',() => {
            console.log('test')
        })
        document.addEventListener('test2',handleTest)
        return clearData
    })
    return (
        <div>test</div>
    )
}
