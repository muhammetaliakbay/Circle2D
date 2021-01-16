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
    const count = chance.integer({min: 40, max:100});
    const minRadius = 1;
    const maxRadius = 9;
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
        const v = chance.floating({min: 0, max: maxVComp});
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
        ),
        /*new StaticLine(
            new Vector(0, maxY), new Vector(maxX, 0)
        )*/
    ];

    const elements = [
        ...circles,
        ...lines
    ];

    let impact = calculateNextImpact(elements);
    let timeOffset = 0;

    const speed = 1/1000;
    // const fps = 20;
    const animation = (frameTime) => {
        const time = frameTime * speed;
        // const nextTime = (frameTime + (1000/fps)) * speed;

        while(impact != undefined && (timeOffset + impact.time) <= time) {
            timeOffset += impact.time;

            applyResponse(impact, elements);
            impact = calculateNextImpact(elements, impact);
        }

        const drawTime = time - timeOffset;

        tool.clear();

        for (const circle of circles) {
            const impactCircle = impact?.A === circle || impact?.B === circle;

            tool.drawCircle({
                center: circle.getPositionByTime(drawTime),
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

        const totalEnergy = elements
            .filter(elm => elm instanceof Circle)
            .reduce(
                (totalEnergy, circle: Circle) =>
                    totalEnergy + Vector.scalar(circle.velocity) * circle.mass,
                0
            );

        tool.drawText({
            text: `Total Energy: ${totalEnergy}`,
            position: {x: 30, y: 30},
            anchor: 'top',
            style: {fill: 'white'}
        });

        window.requestAnimationFrame(animation);
    };

    window.requestAnimationFrame(animation);
}