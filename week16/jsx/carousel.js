import { Component, STATE, ATTRIBUTES } from './framework.js';
import { enableGesture } from './gesture.js';
import { Timeline, Animation } from './animation.js';
import { ease } from './ease.js';

export { STATE, ATTRIBUTES } from './framework.js';

export class Carousel extends Component {
    constructor() {
        super();
    }

    render() {
        this.root = document.createElement('div');
        this.root.classList.add('carousel');

        for (let record of this[ATTRIBUTES].src) {
            let child = document.createElement('div');
            child.style.backgroundImage = `url('${record.img}')`;
            this.root.appendChild(child);
        }
        // 1. 使用gesture库
        enableGesture(this.root);

        let timeline = new Timeline;
        timeline.start();

        // 5.2 用来
        let handler = null;

        let children = this.root.children;

        // the index of the image in the viewport
        this[STATE].position = 0;
        // 5.1, 用来计算偏移量
        let t = 0;
        let ax = 0;

        // 5. 加上start来pause timeline，
        // 但是(1)在动画过程中拖的时候位置不对, 需要计算偏移量弥补
        //    (2)在拖拽时，图片还是在不停变，因为setInterval没有停, 设置一个handler，在start的时候同时clearInterval
        this.root.addEventListener('start', event => {
            timeline.pause();
            clearInterval(handler);
            if(Date.now() - t < 1500) {
                let progress = (Date.now() - t) / 1500; // 1500 为动画时长
                ax = ease(progress) * 500 - 500;
            } else {
                ax = 0;
            }
        })

        this.root.addEventListener('tap', event => {
            this.triggerEvent('click', {
                data: this[ATTRIBUTES].src[this[STATE].position],
                position: this[STATE].position
            });
        })

        // 2. pan事件来拖拽
        this.root.addEventListener('pan', event => {
            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % 500) / 500);
            // 只需要处理current及相邻的图片
            for (let offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;
                children[pos].style.transition = 'none';
                children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
            }
        })

        // 8.使用end事件，而不是panend事件，使得不是pan的时候也能工作
        this.root.addEventListener('end', event => {
            timeline.reset();
            timeline.start();
            handler = setInterval(nextPicture, 3000);
            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % 500) / 500);

            let direction = Math.round((x % 500) / 500);

            if(event.isFlick){
                if(x > 0) { // 7. bug, 目前gesture里velocity不可能为负，需要用方向来判断, 而不是velocity
                    direction = Math.ceil((x % 500) / 500)
                } else {
                    direction = Math.floor((x % 500) / 500)
                }
                console.log(event.velocity);
            }
            
            // 只需要处理current及相邻的图片
            for (let offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;
                children[pos].style.transition = 'none';
                // children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
                timeline.add(new Animation(children[pos].style, "transform", 
                    - pos * 500 + offset * 500 + x % 500, 
                    - pos * 500 + offset * 500 + direction * 500, 
                    1500, 0, ease, v => `translateX(${v}px)`));
            }
            this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction;
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length;
            
            this.triggerEvent("change", {position: this[STATE].position});
        })

        // 3. 使用timeline来实现轮播，
        let nextPicture = () => {
            let children = this.root.children;
            // current = (current + 1) % children.length;   // 这种方法会从最后一张往前返回第一张
            // position = ((position) % children.length + children.length) % children.length;
            let nextIndex = (this[STATE].position + 1) % children.length;
            let current = children[this[STATE].position];
            let next = children[nextIndex];

            t = Date.now();
            // 将next放在初始位置（current后面），这里需要将transition设为none
            // next.style.transition = 'none';
            // next.style.transform = `translateX(${500 - nextIndex * 500}px)`;

            // 4. 往timeline加animation， 替换掉setTimeout
            timeline.add(new Animation(current.style, "transform", 
                - this[STATE].position * 500, -500 - this[STATE].position * 500, 1500, 0, ease, v => `translateX(${v}px)`));
            timeline.add(new Animation(next.style, "transform", 
                500 - nextIndex * 500, - nextIndex * 500, 1500, 0, ease, v => `translateX(${v}px)`));

            
            this[STATE].position = nextIndex;

            this.triggerEvent("change", {position: this[STATE].position});
            // setTimeout(() => {
            //     // 开启transition，current和next进行动画
            //     next.style.transition = '';
            //     current.style.transform = `translateX(${-100 - position * 100}%)`;
            //     next.style.transform = `translateX(${-nextIndex * 100}%)`;
            //     // 更新currentIndex
            //     position = nextIndex;
            // }, 16);
        }

        handler = setInterval(nextPicture, 3000);
        /*
        this.root.addEventListener('mousedown', event => {
            console.log("mousedown");
            let children = this.root.children;
            let startX = event.clientX;
            let move = event => {
                let x = event.clientX - startX;

                let current = position - ((x - x % 500) / 500);

                // 只需要处理current及相邻的图片
                for(let offset of [-1, 0, 1]) {
                    let pos = (current + offset + children.length) % children.length;
                    children[pos].style.transition = 'none';
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
                }
            }

            let up = event => {
                let x = event.clientX - startX;

                position = position - Math.round(x / 500);

                // [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))] 来处理图片在拖拽过程中飞来飞去的问题
                for(let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                    let pos = (position + offset + children.length) % children.length;
                    // 开启transition
                    children[pos].style.transition = '';
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`;
                }
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            }
            document.addEventListener('mousemove', move);

            document.addEventListener('mouseup', up);
        })

        /*
        // 自动播放
        // let current = 0;   
        let currentIndex = 0;
        setInterval(() => {
            let children = this.root.children;
            // current = (current + 1) % children.length;   // 这种方法会从最后一张往前返回第一张

            let nextIndex = (currentIndex + 1) % children.length;
            let current = children[currentIndex];
            let next = children[nextIndex];

            // 将next放在初始位置（current后面），这里需要将transition设为none
            next.style.transition = 'none';
            next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

            setTimeout(() => {
                // 开启transition，current和next进行动画
                next.style.transition = '';
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
                next.style.transform = `translateX(${-nextIndex * 100}%)`;
                // 更新currentIndex
                currentIndex = nextIndex;
            }, 16);
        }, 3000);
        */
        return this.root;
    }
}