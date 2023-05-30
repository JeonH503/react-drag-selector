import { useRef,useMemo,useState, useEffect } from "react"

export default function Grid({children}) {
    const dragBoxInitData = {left:0,top:0,width:0,height:0}
    const cellRef = useRef([])
    const dragArea = useRef()
    const dragWrap = useRef()
    const [mouse,setMouse] = useState(false);
    const [startPoint, setStartPoint] = useState({x:0,y:0});
    const [dragBoxStyle, setDragBoxStyle] = useState(dragBoxInitData);

    const renderChildren = useMemo(() => {
        let cells = children.map((el,index) => {
            return <div key={index} ref={_el=>cellRef.current[index] = _el}>{el}</div>
        })
        return cells
    },[children])

    const mouseDownEvent = (e) => {
        setMouse(true);
        setDragBoxStyle(dragBoxInitData);
        let x = e.pageX
        let y = e.pageY
        setStartPoint({x,y})
    }

    const mouseUpEvent = () => {
        setMouse(false);
        setDragBoxStyle(dragBoxInitData);
    }

    const mouseMoveEvent = (e) => {
        if(mouse) {
            let newEndPoint = {x:e.pageX, y:e.pageY}
            let newStartPoint = {...startPoint}
            if(e.pageX < startPoint.x) {
                
                newEndPoint.x = newStartPoint.x
                newStartPoint.x = e.pageX
            } else {
                newEndPoint.x = e.pageX
            }

            if(e.pageY < startPoint.y) {
                newEndPoint.y = newStartPoint.y
                newStartPoint.y = e.pageY
            } else {
                newEndPoint.y = e.pageY
            }

            setDragBoxStyle({
                left:newStartPoint.x,
                top:newStartPoint.y,
                width:newEndPoint.x - newStartPoint.x,
                height:newEndPoint.y - newStartPoint.y,
            })
        }
    }

    useEffect(() => {
        (function(){
            if(mouse) {
                cellRef.current.forEach(cell => {
                    let cellBox = cell
                    let dragBox = dragBoxStyle
                    
                    // 예외처리 모두 0일때는 생략
                    if(!(dragBox.left + dragBox.width + dragBox.top + dragBox.height))
                        return
                    if(cellBox.offsetLeft <= (dragBox.left + dragBox.width) &&
                        cellBox.offsetLeft + cellBox.clientWidth >=  dragBox.left &&
                        cellBox.offsetTop <= (dragBox.top + dragBox.height) &&
                        cellBox.offsetTop + cellBox.clientHeight >=  dragBox.top) {
                        cell.children[0].style.background = 'red'
                    } else {
                        cell.children[0].style.background = 'none'
                    }
                })
            }
        })()
    },[dragBoxStyle])

    return <div ref={dragWrap} onMouseMove={mouseMoveEvent} onMouseDown={mouseDownEvent} onMouseUp={mouseUpEvent} onMouseLeave={mouseUpEvent}>
        <div style={{display:"flex", flexDirection:'row', userSelect:"none"}}>
            {renderChildren}
        </div>
        <div style={{...dragBoxStyle, position:'absolute', background:'black'}} ref={dragArea}></div>
    </div>
}