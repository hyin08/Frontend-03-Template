const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");
export class Timeline {
    constructor() {
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }

    start() {
        let startTime = Date.now();
         // 使用Symbol, 避免外面不小心访问
        this[TICK] = () => {
            let now = Date.now()
            for(let animation of this[ANIMATIONS]) {
                let t;
                if(this[START_TIME].get(animation) < startTime)
                    t = now - startTime;
                else // 运行过程中可以添加动画
                    t = now - this[START_TIME].get(animation);
                // 终止当前animation
                if(animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    // 处理最后超出duration范围的问题
                    t = animation.duration;
                }
                animation.receive(t);
            }
            requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }

    // set rate(){}
    // get rate(){}
    
    pause() {

    }

    resume() {

    }

    reset() {}

    add(animation, startTime) {
        if(arguments.length < 2)
            startTime = Date.now();
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFunction) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
    }

    receive(time) {

        let range = this.endValue - this.startValue;
        this.object[this.property] = this.startValue + range * time / this.duration;
    }
}