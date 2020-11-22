const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");
const PAUSE_START = Symbol("pause-start");
const PAUSE_TIME = Symbol("pause-time");

export class Timeline {
    constructor() {
        this.state = "Inited";
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }

    start() {
        if(this.state !== "Inited")
            return;
        this.state = "started";
        let startTime = Date.now();
        // 初始化pause时长0
        this[PAUSE_TIME] = 0;
         // 使用Symbol, 避免外面不小心访问
        this[TICK] = () => {
            let now = Date.now()
            for(let animation of this[ANIMATIONS]) {
                let t;
                if(this[START_TIME].get(animation) < startTime)
                    t = now - startTime - this[PAUSE_TIME] - animation.delay;  // 引入pause，需要减去PAUSE_TIME; 引入delay，需要减animation.dalay
                else // 运行过程中可以添加动画
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
                // 终止当前animation
                if(animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    // 处理最后超出duration范围的问题
                    t = animation.duration;
                }
                if(t > 0)
                    animation.receive(t);
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }

    // set rate(){}
    // get rate(){}
    
    pause() {
        if(this.state !== "started")
            return;
        this.state = "paused";
        // 记录pause起始时间
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }

    resume() {
        if(this.state !== "paused")
            return;
        this.state = "started";
        // 记录PAUSE时长
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
    }

    reset() {
        this.pause();
        this.state = "Inited";
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[PAUSE_START] = 0;
        this[TICK_HANDLER] = null;
    }

    add(animation, startTime) {
        if(arguments.length < 2)
            startTime = Date.now();
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        timingFunction = timingFunction || (v => v);
        template = template || (v => v);
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        // timingFunction是一个输入0~1， 返回0~1的progress
        this.timingFunction = timingFunction;
        this.template = template;
    }

    receive(time) {
        let range = this.endValue - this.startValue;
        // 加入 timingFunction
        let progress = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + range * progress);
    }
}