import React, {useState, useEffect} from "react";

function Demo2() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        window.addEventListener('test',() => {
            console.log('test')
        })
    })
    return (
        <div>test</div>
    )
}
