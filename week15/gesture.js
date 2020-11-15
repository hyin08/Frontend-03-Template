let element = document.documentElement;

element.addEventListener('mousedown', event => {
    start(event);

    let mousemove = event => {
        // console.log(event.clientX, event.clientY);
        move(event);
    }

    let mouseup = event => {
        end(event);
        element.removeEventListener('mousemove', mousemove);
        element.removeEventListener('mouseup', mouseup);
    }
    element.addEventListener('mousemove', mousemove);
    element.addEventListener('mouseup', mouseup);
})

// touch事件一旦start以后，会同时触发move，所以不需要像鼠标那样在mousedown之后触发move

element.addEventListener('touchstart', event => {
    // event跟mouse里的不一样，里面有多个触点
    // console.log(event.changedTouches);
    for(let touch of event.changedTouches) {
        // console.log("start", touch.clientX, touch.clientY);
        start(touch);
    }
})

element.addEventListener('touchmove', event => {
    for(let touch of event.changedTouches) {
        // console.log("move", touch.clientX, touch.clientY);
        move(touch);
    }
})

element.addEventListener('touchend', event => {
    for(let touch of event.changedTouches) {
        // console.log("end", touch.clientX, touch.clientY);
        end(touch);
    }
})

// 非正常end，如alert...
element.addEventListener('touchcancel', event => {
    for(let touch of event.changedTouches) {
        // console.log("cancel", touch.clientX, touch.clientY);
        cancel(touch);
    }
})


// 对鼠标和touch进行统一的抽象
let start = (point) => {
    console.log("start", point.clientX, point.clientY);
}

let move = (point) => {
    console.log("move", point.clientX, point.clientY);
}

let end = (point) => {
    console.log("end", point.clientX, point.clientY);
}

let cancel = (point) => {
    console.log("cancel", point.clientX, point.clientY);
}