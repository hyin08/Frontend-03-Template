const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");
const PAUSE_START = Symbol("pause-start");
const PAUSE_TIME = Symbol("pause-time");

export class Timeline {
    constructor() {
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }

    start() {
        let startTime = Date.now();
        // 初始化pause时长0
        this[PAUSE_TIME] = 0;
         // 使用Symbol, 避免外面不小心访问
        this[TICK] = () => {
            let now = Date.now()
            for(let animation of this[ANIMATIONS]) {
                let t;
                if(this[START_TIME].get(animation) < startTime)
                    t = now - startTime - this[PAUSE_TIME];  // 引入pause，需要减去PAUSE_TIME
                else // 运行过程中可以添加动画
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME];
                // 终止当前animation
                if(animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    // 处理最后超出duration范围的问题
                    t = animation.duration;
                }
                animation.receive(t);
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }

    // set rate(){}
    // get rate(){}
    
    pause() {
        // 记录pause起始时间
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }

    resume() {
        // 记录PAUSE时长
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
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
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
        this.template = template;
    }

    receive(time) {

        let range = this.endValue - this.startValue;
        this.object[this.property] = this.template(this.startValue + range * time / this.duration);
    }
}