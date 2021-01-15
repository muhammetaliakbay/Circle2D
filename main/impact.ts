import {Circle} from "./circle";
import {calculateRoots} from "./polynom";
import {StaticLine} from "./static-line";
import {Vector} from "./vector";

export function calculateCircleCircleImpactTime(
    A: Circle, B: Circle
): { time: number, point: Vector } | undefined {
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
    let t;

    if (t1 < 0) {
        t = t2 < 0 ? undefined : t2;
    } else if (t2 < 0) {
        t = t1 < 0 ? undefined : t1;
    } else {
        t = Math.min(t1, t2);
    }

    if (t == undefined || isNaN(t)) {
        return undefined;
    } else {
        const centerA = A.getPositionByTime(t);
        const centerB = B.getPositionByTime(t);

        const point = new Vector(
            (centerA.x * B.radius + centerB.x * A.radius) / (A.radius + B.radius),
            (centerA.y * B.radius + centerB.y * A.radius) / (A.radius + B.radius)
        );

        return {
            point,
            time: t
        }
    }
}

export function calculateStaticLineCircleImpactTime(
    line: StaticLine, circle: Circle
): {time: number, point: Vector} | undefined {
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

    let t;

    if (t1 < 0) {
        t = t2 < 0 ? undefined : t2;
    } else if (t2 < 0) {
        t = t1 < 0 ? undefined : t1;
    } else {
        t = Math.min(t1, t2);
    }

    if (t == undefined || isNaN(t)) {
        return undefined;
    } else {
        const center = circle.getPositionByTime(t);

        let point: Vector;
        if (a == 0) {
            point = new Vector(center.x, A.y /*or B.y*/);
        } else if (b == 0) {
            point = new Vector(A.x /*or B.x*/, center.y);
        } else {
            const x = (a * center.x - b * center.y - c) / (2 * a);
            const y = -(c + a * x) / b;
            point = new Vector(x, y);
        }

        return {
            point,
            time: t
        } as any;
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

export function calculateImpact(
    a: StaticLine | Circle, b: StaticLine | Circle
): {
    time: number,
    point: Vector
} | undefined {
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

export interface Impact {
    A: Circle | StaticLine,
    B: Circle | StaticLine,
    time: number,
    point: Vector
}

export function calculateNextImpact(
    elements: (Circle | StaticLine)[],
    lastImpact?: Impact
): Impact | undefined {
    let closestImpact: {A: Circle | StaticLine, B: Circle | StaticLine, time: number, point: Vector} = undefined;

    const count = elements.length;
    for (let i = 0; i < count - 1; i++) {
        const A = elements[i];

        for (let j = i + 1; j < count; j++) {

            const B = elements[j];

            const impact = calculateImpact(A, B);
            if (
                impact != undefined &&
                !(A === lastImpact?.A && B === lastImpact?.B) &&
                (closestImpact == undefined || impact.time < closestImpact.time)
            ) {
                closestImpact = {A, B, ...impact};
            }

        }
    }

    return closestImpact;
}
