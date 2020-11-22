import { Component, STATE, ATTRIBUTES, createElement } from './framework.js';
import { enableGesture } from './gesture.js';

export {STATE, ATTRIBUTES} from './framework.js';

export class List extends Component {
    constructor() {
        super();
    }
    
    render() {
        this.children = this[ATTRIBUTES].data.map(this.template);
        console.log(this.children);
        this.root = (<div>{this.children}</div>).render();
        return this.root;
    }

    // 级联的child，不是吧children放在root下，重载appendChild
    appendChild(child) {
        this.template = child;
    }
}