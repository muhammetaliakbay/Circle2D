import {Circle} from "./circle";
import {calculateRoots} from "./polynom";

function calculateImpactTimeNonOptimized(
    A: Circle, B: Circle
): number | undefined {

    const a = (A.velocity.x**2 - 2*A.velocity.x*B.velocity.x + B.velocity.x**2) + (A.velocity.y**2 - 2*A.velocity.y*B.velocity.y + B.velocity.y**2);
    const b = (2*A.velocity.x*A.position.x - 2*A.velocity.x*B.position.x - 2*B.velocity.x*A.position.x + 2*B.velocity.x*B.position.x) +
              (2*A.velocity.y*A.position.y - 2*A.velocity.y*B.position.y - 2*B.velocity.y*A.position.y + 2*B.velocity.y*B.position.y);
    const c = (-2*A.position.x*B.position.x + A.position.x**2 + B.position.x**2) +
              (-2*A.position.y*B.position.y + A.position.y**2 + B.position.y**2)
              -(A.radius + B.radius)**2;

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

export function calculateImpactTime(
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

export function calculateNextImpact(
    circles: Circle[]
): {A: Circle, B: Circle, time: number} | undefined {
    let closestImpact: {A: Circle, B: Circle, time: number} = undefined;

    const count = circles.length;
    for (let i = 0; i < count - 1; i++) {
        const A = circles[i];

        for (let j = i + 1; j < count; j++) {

            const B = circles[j];

            const time = calculateImpactTime(A, B);
            if (time != undefined && (closestImpact == undefined || time < closestImpact.time)) {
                closestImpact = {A, B, time};
            }

        }
    }

    return closestImpact;
}
