import {Circle} from "../main/circle";
import {Vector} from "../main/vector";
import {calculateCircleCircleImpactTime} from "../main/impact";

const A = new Circle(
    1,
    new Vector(0, 0),
    new Vector(0, 1)
);

const B = new Circle(
    1,
    new Vector(10, 10),
    new Vector(-1, 0)
);

const impactT = calculateCircleCircleImpactTime(A, B);
console.log(impactT);