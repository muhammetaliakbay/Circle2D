import {Vector} from "./vector";
import {Element} from "./element";

export class StaticLine implements Element {
    constructor(
        public a: Vector,
        public b: Vector
    ) {
    }

    getType(): string {
        return 'static-line';
    }
    isStatic(): boolean {
        return true;
    }
}