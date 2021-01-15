import {Circle} from "./circle";
import {calculateRoots} from "./polynom";
import {StaticLine} from "./static-line";

export function calculateCircleCircleImpactTime(
    A: Circle, B: Circle
): number | undefined {
    const a = (A.velocity.x - B.velocity.x)**2 + (A.velocity.y - B.velocity.y)**2;

    const b = 2*(
        A.velocity.x*(A.position.x - B.position.x) + B.velocity.x*(B.position.x - A.position.x) +
        A.velocity.y*(A.position.y - B.position.y) + B.velocity.y*(B.position.y - A.position.y)
    );

    const c = (A.position.x - B.position.x)**2 + (A.position.y - B.position.y)**2 - (A.radius + B.radius)**2;

    const roots = calculateRoots(a, b, c);
    if (roots == undefined) {
        return undefined;
    }

    const [t1, t2] = roots;

    if (t1 < 0) {
        return t2 < 0 ? undefined : t2;
    } else if (t2 < 0) {
        return t1 < 0 ? undefined : t1;
    } else {
        return Math.min(t1, t2);
    }
}

export function calculateStaticLineCircleImpactTime(
    line: StaticLine, circle: Circle
): number | undefined {
    let A = line.a;
    let B = line.b;

    if ((A.x - B.x) / (A.y - B.y) < 0) {
        let tmp = A;
        A = B;
        B = tmp;
    }

    const a = B.y - A.y;
    const b = A.x - B.x;
    const c = -a * A.x + -b * A.y;

    const tDivider = ( a * circle.velocity.x + b * circle.velocity.y );

    if (tDivider == 0) {
        return undefined;
    }

    const t1 =
        ( -(a * circle.position.x + b * circle.position.y + c) + circle.radius * Math.sqrt(a**2 + b**2) ) / tDivider;

    const t2 =
        ( -(a * circle.position.x + b * circle.position.y + c) - circle.radius * Math.sqrt(a**2 + b**2) ) / tDivider;

    if (t1 < 0) {
        return t2 < 0 ? undefined : t2;
    } else if (t2 < 0) {
        return t1 < 0 ? undefined : t1;
    } else {
        return Math.min(t1, t2);
    }
}

const impactTimeCalculators = {
    'static-line': {
        'circle': calculateStaticLineCircleImpactTime
    },
    'circle': {
        'circle': calculateCircleCircleImpactTime
    }
};

export function calculateImpactTime(
    a: StaticLine | Circle, b: StaticLine | Circle
): number | undefined {
    let calculator = impactTimeCalculators[a.getType()]?.[b.getType()];
    if (calculator == undefined) {
        calculator = impactTimeCalculators[b.getType()]?.[a.getType()];
        if (calculator == undefined) {
            return undefined;
        } else {
            return calculator(b, a);
        }
    }

    return calculator(a, b);
}

export function calculateNextImpact(
    elements: (Circle | StaticLine)[]
): {A: Circle | StaticLine, B: Circle | StaticLine, time: number} | undefined {
    let closestImpact: {A: Circle | StaticLine, B: Circle | StaticLine, time: number} = undefined;

    const count = elements.length;
    for (let i = 0; i < count - 1; i++) {
        const A = elements[i];

        for (let j = i + 1; j < count; j++) {

            const B = elements[j];

            const time = calculateImpactTime(A, B);
            if (time != undefined && (closestImpact == undefined || time < closestImpact.time)) {
                closestImpact = {A, B, time};
            }

        }
    }

    return closestImpact;
}
