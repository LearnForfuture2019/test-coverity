import React, {useState, useEffect} from "react";
const obserFunc = (str,callback)=>{
    const cb = (callback) =>{
        return '123'
    }
    window.addEventListener(str,cb)
    return window.removeEventListener(str,cb)
}
function Demo2() {
    const [count, setCount] = useState(0)
    const handleTest = () => {
        console.log('this is a test')
    }
    useEffect(() => {
        window.addEventListener('test',() => {
            console.log('test')
        })
        document.addEventListener('test2',handleTest)
        return () => window.removeEventListener('test',handleTest)
    })
    return (
        <div>test</div>
    )
}
