import {Vector} from "./vector";
import {Element} from "./element";

export class Circle implements Element {
    constructor(
        public radius: number,
        public position: Vector,
        public velocity: Vector
    ) {
    }

    getType(): string {
        return 'circle';
    }
    isStatic(): boolean {
        return false;
    }

    public getPositionByTime(time: number): Vector {
        return new Vector(
            this.position.x + this.velocity.x * time,
            this.position.y + this.velocity.y * time
        );
    }
}