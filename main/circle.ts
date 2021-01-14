import {Vector} from "./vector";

export class Circle {
    constructor(
        public radius: number,
        public position: Vector,
        public velocity: Vector
    ) {
    }

    public getPositionByTime(time: number): Vector {
        return new Vector(
            this.position.x + this.velocity.x * time,
            this.position.y + this.velocity.y * time
        );
    }
}