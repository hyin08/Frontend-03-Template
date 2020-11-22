import { Timeline, Animation } from './animation.js';
import { ease, easeIn, easeOut, easeInOut } from './ease'
let tl = new Timeline();


tl.start();

tl.add(new Animation(document.querySelector("#el").style, "transform", 0, 500, 2000, 0, ease, v => `translateX(${v}px)`));

// el2对比el
document.querySelector("#el2").style.transition = 'transform ease 2s';
document.querySelector("#el2").style.transform = 'translateX(500px)';

// pause 和 resume button
document.querySelector('#pause-btn').addEventListener('click', () => tl.pause());
document.querySelector('#resume-btn').addEventListener('click', () => tl.resume());