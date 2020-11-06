import { Component } from './framework.js';
export class Carousel extends Component {
    constructor() {
        super();
        this.attributes = Object.create(null);
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    render() {
        this.root = document.createElement('div');
        this.root.classList.add('carousel');

        for(let record of this.attributes.src) {
            let child = document.createElement('div');
            child.style.backgroundImage = `url('${record}')`;
            this.root.appendChild(child);
        }


        // the index of the image in the viewport
        let position = 0;
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

    // 在mountTo中调render(),保证render在setAttribute之后
    mountTo(parent) {
        parent.appendChild(this.render());
    }
}