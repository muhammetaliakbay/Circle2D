export class Vector {
    constructor(
        public x: number,
        public y: number
    ) {
    }

    static negate(vector: Vector): Vector {
        return new Vector(-vector.x, -vector.y);
    }

    static add(a: Vector, b: Vector): Vector {
        return new Vector(a.x + b.x, a.y + b.y);
    }

    static subtract(a: Vector, b: Vector): Vector {
        return new Vector(a.x - b.x, a.y - b.y);
    }

    static scalarSquared(vector: Vector): number {
        return vector.x**2 + vector.y**2;
    }
    static scalar(vector: Vector): number {
        return Math.sqrt(
            Vector.scalarSquared(vector)
        );
    }

    static multiply(vector: Vector, multiplier: number): Vector {
        return new Vector(vector.x * multiplier, vector.y * multiplier);
    }
    static divide(vector: Vector, divider: number): Vector {
        return new Vector(vector.x / divider, vector.y / divider);
    }

    static angle(vector: Vector): number {
        return Math.atan2(vector.y, vector.x);
    }

    static unit(angle: number): Vector {
        return new Vector(Math.cos(angle), Math.sin(angle));
    }

    static innerProduct(a: Vector, b: Vector): number {
        return a.x * b.x + a.y * b.y;
    }
}