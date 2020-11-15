// export function dispatch(type, properties) {
//     let event = new Event(type);
//     for (let name in properties) {
//         event[name] = properties[name];
//     }
//     element.dispatchEvent(event);
// }
export class Dispatcher {
    constructor(element) {
        this.element = element;
    }
    
    dispatch(type, properties) {
        let event = new Event(type);
        for (let name in properties) {
            event[name] = properties[name];
        }
        this.element.dispatchEvent(event);
    }
}
// listen -> recognize -> dispatch

// new Listener(new Recognizer(dispatch))
export class Listener {
    constructor(element, recognizer) {
        let isListeningMouse = false;
        let contexts = new Map(); // 多点触发，存储在一个map里
        element.addEventListener('mousedown', event => {

            let context = Object.create(null);
            contexts.set("mouse" + (1 << event.button), context);
            recognizer.start(event, context);

            let mousemove = event => {
                // console.log(event.clientX, event.clientY);
                // move没有event.button, 有event.buttons,表示哪些键(5个键）被按下 e.g. 0b11111
                let button = 1;
                while (button <= event.buttons) {
                    if (button & event.buttons) {
                        // order of buttons  & button property are not same
                        let key;
                        if (button === 2)
                            key = 4;
                        else if (button === 4)
                            key = 2;
                        else
                            key = button;
                        let context = contexts.get("mouse" + key);
                        recognizer.move(event, context);
                    }
                    button = button << 1;
                }
            }

            let mouseup = event => {
                let context = contexts.get("mouse" + (1 << event.button));
                recognizer.end(event, context);
                contexts.delete("mouse" + (1 << event.button));

                // 判断是否所有按键都已松开
                if (event.buttons === 0) {
                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseup);
                    isListeningMouse = false;
                }
            }
            // 避免多个按键按下后，重复监听
            if (!isListeningMouse) {
                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseup);
                isListeningMouse = true;
            }
        });

        // touch事件一旦start以后，会同时触发move，所以不需要像鼠标那样在mousedown之后触发move

        element.addEventListener('touchstart', event => {
            // event跟mouse里的不一样，里面有多个触点
            // console.log(event.changedTouches);
            for (let touch of event.changedTouches) {
                // console.log("start", touch.clientX, touch.clientY);
                let context = Object.create(null);
                contexts.set(touch.identifier, context);
                recognizer.start(touch, context);
            }
        })

        element.addEventListener('touchmove', event => {
            for (let touch of event.changedTouches) {
                // console.log("move", touch.clientX, touch.clientY);
                let context = contexts.get(touch.identifier);
                recognizer.move(touch, context);
            }
        })

        element.addEventListener('touchend', event => {
            for (let touch of event.changedTouches) {
                // console.log("end", touch.clientX, touch.clientY);
                let context = contexts.get(touch.identifier);
                recognizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        })

        // 非正常end，如alert...
        element.addEventListener('touchcancel', event => {
            for (let touch of event.changedTouches) {
                // console.log("cancel", touch.clientX, touch.clientY);
                let context = contexts.get(touch.identifier);
                recognizer.cancel(touch, context);
                contexts.delete(touch.identifier);
            }
        })
    }
}

// 对鼠标和touch进行统一的抽象
export class Recognizer {
    constructor(dispatcher) { 
        this.dispatcher = dispatcher;
    }

    start(point, context) {
        // console.log("start", point.clientX, point.clientY);
        // 记录初始位置，以计算移动10px -> pan start
        context.startX = point.clientX, context.startY = point.clientY;
        // 存储多个点，来计算速度
        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }];

        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        context.isFlick = false;
        // 0.5s -> press start
        context.handler = setTimeout(() => {
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.handler = null;
            this.dispatcher.dispatch("press", {});
        }, 500);
    }

    // flick事件需要计算速度，我们存储一段时间内多个点，来计算平均速度，减少误差
    move(point, context) {
        // console.log("move", point.clientX, point.clientY);
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
        // 处理10px的逻辑
        if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            context.isVertical = Math.abs(dx) < Math.abs(dy);
            // console.log("panstart");
            this.dispatcher.dispatch("panstart", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
            })
            clearTimeout(context.handler);
        }

        if (context.isPan) {
            // console.log(dx, dy);
            // console.log("pan");
            this.dispatcher.dispatch("pan", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
            })
        }

        // 只保留最近0.5s内的点来计算速度
        context.points = context.points.filter(point => Date.now() - point.t < 500)

        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        })
    };

    end(point, context) {
        if (context.isTap) {
            // console.log("tap");
            this.dispatcher.dispatch("tap", {});
            clearTimeout(context.handler);
        }

        if (context.isPress) {
            // console.log("pressend");
            this.dispatcher.dispatch("pressend", {});
        }
        // 结束时计算速度, 如果最后不动，v = 0
        context.points = context.points.filter(point => Date.now() - point.t < 500);
        let d, v;
        if (!context.points.length) {
            v = 0;
        } else {
            d = Math.sqrt((point.clientX - context.points[0].x) ** 2 +
                (point.clientY - context.points[0].y) ** 2);
            v = d / (Date.now() - context.points[0].t);
        }

        if (v > 1.5) {
            // console.log("flick");
            this.dispatcher.dispatch("flick", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            })
            context.isFlick = true;
        } else {
            context.isFlick = false;
        }

        if (context.isPan) {
            // console.log("panend");
            this.dispatcher.dispatch("panend", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
            })
        }
        // console.log("end", point.clientX, point.clientY);
    }

    cancel(point, context) {
        clearTimeout(context.handler);
        // console.log("cancel", point.clientX, point.clientY);
        this.dispatcher.dispatch("cancel", {});
    }
}

export function enableGesture(element) {
    new Listener(element, new Recognizer(new Dispatcher(element)));
}