import {Impact} from "./impact";
import {Circle} from "./circle";
import {Vector} from "./vector";
import {Element} from "./element";
import {StaticLine} from "./static-line";

const responseGenerators = {
    'static-line': {
        'circle': responseStaticLineCircle
    },
    /*'circle': {
        'circle': responseCircleCircle
    }*/
};

function responseStaticLineCircle(line: StaticLine, circle: Circle) {
    const lineAngle = Math.atan2(line.b.y - line.a.y, line.b.x - line.a.x);
    const velocityAngle = Math.atan2(circle.velocity.y, circle.velocity.x);
    const hitAngle = velocityAngle - lineAngle;
    const responseAngle = - hitAngle + lineAngle;

    const v = Math.sqrt(circle.velocity.x ** 2 + circle.velocity.y ** 2);

    circle.velocity = new Vector(
        Math.cos(responseAngle) * v,
        Math.sin(responseAngle) * v
    );
}

function generateResponse(
    impact: Impact
): boolean {
    const a = impact.A;
    const b = impact.B;

    let generator = responseGenerators[a.getType()]?.[b.getType()];
    if (generator == undefined) {
        generator = responseGenerators[b.getType()]?.[a.getType()];
        if (generator == undefined) {
            return false;
        } else {
            generator(b, a, impact.point);
            return true;
        }
    }

    generator(a, b, impact.point);
    return true;
}

export function applyResponse(
    impact: Impact,
    elements: Element[]
): void {
    for (const elm of elements) {
        if (elm instanceof Circle) {
            elm.position = elm.getPositionByTime(impact.time);
        }
    }

    if (!generateResponse(impact)) {
        for (const elm of [impact.A, impact.B]) {
            if (elm instanceof Circle) {
                elm.velocity = new Vector(0, 0);
            }
        }
    }
}