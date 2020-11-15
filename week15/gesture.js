let element = document.documentElement;

let isListeningMouse = false;
element.addEventListener('mousedown', event => {
    
    let context = Object.create(null);
    contexts.set("mouse" + (1 << event.button), context);
    start(event, context);

    let mousemove = event => {
        // console.log(event.clientX, event.clientY);
        // move没有event.button, 有event.buttons,表示哪些键(5个键）被按下 e.g. 0b11111
        let button = 1;
        while(button <= event.buttons) {
            if(button & event.buttons) {
                // order of buttons  & button property are not same
                let key;
                if(button === 2)
                    key = 4;
                else if(button === 4)
                    key = 2;
                else
                    key = button;
                let context = contexts.get("mouse" + key);
                move(event, context);
            }
            button = button << 1;
        }
    }

    let mouseup = event => {
        let context = contexts.get("mouse" + (1 << event.button));
        end(event, context);
        contexts.delete("mouse" + (1 << event.button));

        // 判断是否所有按键都已松开
        if(event.buttons === 0) {
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            isListeningMouse = false;
        }
    }
    // 避免多个按键按下后，重复监听
    if(!isListeningMouse) {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        isListeningMouse = true;
    }
})

// touch事件一旦start以后，会同时触发move，所以不需要像鼠标那样在mousedown之后触发move
let contexts = new Map(); // 多点触发，存储在一个map里
element.addEventListener('touchstart', event => {
    // event跟mouse里的不一样，里面有多个触点
    // console.log(event.changedTouches);
    for(let touch of event.changedTouches) {
        // console.log("start", touch.clientX, touch.clientY);
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        start(touch, context);
    }
})

element.addEventListener('touchmove', event => {
    for(let touch of event.changedTouches) {
        // console.log("move", touch.clientX, touch.clientY);
        let context = contexts.get(touch.identifier);
        move(touch, context);
    }
})

element.addEventListener('touchend', event => {
    for(let touch of event.changedTouches) {
        // console.log("end", touch.clientX, touch.clientY);
        let context = contexts.get(touch.identifier);
        end(touch, context);
        contexts.delete(touch.identifier);
    }
})

// 非正常end，如alert...
element.addEventListener('touchcancel', event => {
    for(let touch of event.changedTouches) {
        // console.log("cancel", touch.clientX, touch.clientY);
        let context = contexts.get(touch.identifier);
        cancel(touch, context);
        contexts.delete(touch.identifier);
    }
})


// 对鼠标和touch进行统一的抽象
// let handler;
// let startX, startY;
// let isPan = false, isTap = true, isPress = false;
let start = (point, context) => {
    // console.log("start", point.clientX, point.clientY);
    // 记录初始位置，以计算移动10px -> pan start
    context.startX = point.clientX, context.startY = point.clientY;

    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    // 0.5s -> press start
    context.handler = setTimeout(() => {
        context.isTap = false;
        context.isPan = false;
        context.isPress = true;
        context.handler = null;
        console.log("press");
    }, 500);
}

let move = (point, context) => {
    // console.log("move", point.clientX, point.clientY);
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    // 处理10px的逻辑
    if(!context.isPan && dx ** 2 + dy ** 2 > 100) {
        context.isTap = false;
        context.isPan = true;
        context.isPress = false;
        console.log("panstart");
        clearTimeout(context.handler);
    }
    
    if(context.isPan) {
        console.log(dx, dy);
        console.log("pan");
    }

}

let end = (point, context) => {
    if(context.isTap) {
        console.log("tap");
        dispatch("tap", {});
        clearTimeout(context.handler);
    }

    if(context.isPan) {
        console.log("panend");
    }

    if(context.isPress) {
        console.log("pressend");
    }
    // console.log("end", point.clientX, point.clientY);
}

let cancel = (point, context) => {
    clearTimeout(context.handler);
    // console.log("cancel", point.clientX, point.clientY);
}


function dispatch(type, properties) {
    let event = new Event(type);
    for(let name in properties) {
        event[name] = properties[name];
    }
    element.dispatchEvent(event);
}