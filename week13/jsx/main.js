import { Component, createElement } from './framework.js';

class Carousel extends Component {
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
        return this.root;
    }

    // 在mountTo中调render(),保证render在setAttribute之后
    mountTo(parent) {
        parent.appendChild(this.render());
    }
}

let d = [
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
];

let a = <Carousel src={d} />;
a.mountTo(document.body);