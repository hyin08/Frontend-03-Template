import { Component, STATE, ATTRIBUTES, createElement } from './framework.js';
import { enableGesture } from './gesture.js';

export {STATE, ATTRIBUTES} from './framework.js';

export class Button extends Component {
    constructor() {
        super();
    }
    
    render() {
        this.childContainer = <span />;
        this.root = (<div>{this.childContainer}</div>).render();
        return this.root;
    }

    // 级联的child，不是吧children放在root下，重载appendChild
    appendChild(child) {
        if(!this.childContainer)
            this.render();
        this.childContainer.appendChild(child);
    }
}