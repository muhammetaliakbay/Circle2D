import {CanvasTool} from "./canvas-tool";
import {Circle} from "../main/circle";
import Chance from 'chance';
import {Vector} from "../main/vector";
import {calculateNextImpact} from "../main/impact";
import {StaticLine} from "../main/static-line";
import {applyResponse} from "../main/response";

const chance = Chance();

const PI2 = Math.PI*2;

export function demo1(
    tool: CanvasTool
) {
    const count = chance.integer({min: 20, max:40});
    const minRadius = 5;
    const maxRadius = 15;
    const minX = 0;
    const maxX = 1000;
    const minY = 0;
    const maxY = 1000;
    const maxVComp = 200;

    const circles: Circle[] = [];
    for (let i = 0; i < count; i ++) {
        let angle = (PI2 / count) * i;
        const x = Math.cos(angle) * (maxX/3) + (maxX/2);
        const y = Math.sin(angle) * (maxY/3) + (maxY/2);
        const v = - chance.floating({min: 0, max: maxVComp});
        const vx = -Math.cos(angle)*v;
        const vy = -Math.sin(angle)*v;
        const radius = chance.floating({
            min: minRadius, max: maxRadius
        });
        const mass = radius**2;
        circles[i] = new Circle(
            radius,
            new Vector(x, y),
            new Vector(vx, vy),
            mass
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

    const elements = [
        ...circles,
        ...lines
    ];

    let impact = calculateNextImpact(elements);

    let timeOffset = 0;
    const animation = (frameTime) => {
        let time = (frameTime - timeOffset)/500;

        if (impact != undefined) {
            time = Math.min(impact.time, time);

            if (time === impact.time) {
                applyResponse(impact, elements);
                impact = calculateNextImpact(elements, impact);
                console.log(impact);
                timeOffset = frameTime;
                time = 0;
            }
        }

        tool.clear();

        for (const circle of circles) {
            const impactCircle = impact?.A === circle || impact?.B === circle;

            tool.drawCircle({
                center: circle.getPositionByTime(time),
                radius: circle.radius,
                style: {fill: impactCircle ? 'red' : 'white'}
            });
        }

        for (const line of lines) {
            const impactLine = impact?.A === line || impact?.B === line;

            tool.drawLine({
                points: {
                    a: line.a,
                    b: line.b
                },
                style: {stroke: impactLine ? 'red' : 'white'}
            });
        }

        if (impact?.point != undefined) {
            const impactPoint = impact.point;
            tool.drawCircle({
                center: impactPoint,
                radius: 4,
                style: {fill: 'yellow'}
            });
        }

        window.requestAnimationFrame(animation);
    };

    window.requestAnimationFrame(animation);
}