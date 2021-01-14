import {CanvasTool} from "./canvas-tool";
import {demo1} from "./demo-1";

const canvas = document.createElement('canvas');

document.body.appendChild(
    canvas
);

const tool = new CanvasTool(canvas);
canvas.width = 1000;
canvas.height = 1000;

canvas.style.backgroundColor='black';

demo1(
    tool
);
