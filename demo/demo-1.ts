import {CanvasTool} from "./canvas-tool";
import {Circle} from "../main/circle";
import Chance from 'chance';
import {Vector} from "../main/vector";
import {calculateNextImpact} from "../main/impact";
import {StaticLine} from "../main/static-line";

const chance = Chance();

const PI2 = Math.PI*2;

export function demo1(
    tool: CanvasTool
) {
    const count = chance.integer({min: 10, max:20});
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
        const v = (i%4==0?-1:2) * chance.floating({min: 0, max: maxVComp});
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

    const lines: StaticLine[] = [
        new StaticLine(
            new Vector(0, 20), new Vector(1, 20)
        ),
        new StaticLine(
            new Vector(20, 0), new Vector(20, 1)
        ),
        new StaticLine(
            new Vector(maxX - 20, 0), new Vector(maxX - 20, 1)
        ),
        new StaticLine(
            new Vector(0, maxY - 20), new Vector(1, maxY - 20)
        )
    ];

    const impact = calculateNextImpact([
        ...circles,
        ...lines
    ]);

    let impactT = impact?.time ?? 10;
    /*let t = 0;

    tool.canvas.addEventListener('mousemove', ev => {
        const mx = ev.x - (ev.target as HTMLCanvasElement).offsetLeft;
        t = (mx / (ev.target as HTMLCanvasElement).width)*impactT;
    });*/

    const animation = (animationTime) => {
        const t = Math.min(animationTime/1000, impactT);

        tool.clear();

        for (const circle of circles) {
            const impactCircle = impact.A === circle || impact.B === circle;

            tool.drawCircle({
                center: circle.getPositionByTime(t),
                radius: circle.radius,
                style: {fill: impactCircle ? 'red' : 'white'}
            });
        }

        for (const circle of circles) {
            const impactCircle = impact.A === circle || impact.B === circle;

            tool.drawCircle({
                center: circle.getPositionByTime(t),
                radius: circle.radius,
                style: {fill: impactCircle ? 'red' : 'white'}
            });
        }

        for (const line of lines) {
            const impactLine = impact.A === line || impact.B === line;

            tool.drawLine({
                points: {
                    a: line.a,
                    b: line.b
                },
                style: {stroke: impactLine ? 'red' : 'white'}
            });
        }

        window.requestAnimationFrame(animation);
    };

    window.requestAnimationFrame(animation);
}