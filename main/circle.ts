import {Vector} from "./vector";

export class Circle {
    constructor(
        public radius: number,
        public position: Vector,
        public velocity: Vector
    ) {
    }
}