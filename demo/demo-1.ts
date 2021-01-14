import {CanvasTool} from "./canvas-tool";
import {Circle} from "../main/circle";
import Chance from 'chance';
import {Vector} from "../main/vector";
import {calculateNextImpact} from "../main/impact";

const chance = Chance();

const PI2 = Math.PI*2;

export function demo1(
    tool: CanvasTool
) {
    const count = 10;
    const minRadius = 10;
    const maxRadius = 30;
    const minX = 0;
    const maxX = 1000;
    const minY = 0;
    const maxY = 1000;
    const maxVComp = 100;

    const circles: Circle[] = [];
    for (let i = 0; i < count; i ++) {
        let angle = (PI2 / count) * i;
        const x = Math.cos(angle) * (maxX/3) + (maxX/2);
        const y = Math.sin(angle) * (maxY/3) + (maxY/2);
        const v = chance.floating({min: 0, max: maxVComp});
        const vx = -Math.cos(angle)*v;
        const vy = -Math.sin(angle)*v;
        circles[i] = new Circle(
            chance.floating({
                min: minRadius, max: maxRadius
            }),
            new Vector(x, y),
            new Vector(vx, vy)
        );
    }

    const impact = calculateNextImpact(circles);

    let impactT = impact?.time ?? 10;
    let t = 0;

    tool.canvas.addEventListener('mousemove', ev => {
        const mx = ev.x - (ev.target as HTMLCanvasElement).offsetLeft;
        t = (mx / (ev.target as HTMLCanvasElement).width)*impactT;
    });

    const animation = () => {
        tool.clear();

        for (const circle of circles) {
            const impactCircle = impact.A === circle || impact.B === circle;

            tool.drawCircle({
                center: circle.getPositionByTime(t),
                radius: circle.radius,
                style: {fill: impactCircle ? 'red' : 'white'}
            });
        }

        window.requestAnimationFrame(animation);
    };

    animation();
}