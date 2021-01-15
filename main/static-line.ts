import {Vector} from "./vector";
import {Element} from "./element";

export class StaticLine implements Element {
    constructor(
        public a: Vector,
        public b: Vector
    ) {
    }

    getType() {
        return 'static-line';
    }
    getMass() {
        return undefined;
    }
}