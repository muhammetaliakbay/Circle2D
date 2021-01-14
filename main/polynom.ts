export function calculateRoots(a: number, b: number, c: number): [x1: number, x2: number] | undefined {
    const d = b**2 - 4*a*c;
    if (d < 0) {
        return undefined;
    }

    const dSqrt = Math.sqrt(d);
    const a_2 = 2*a;

    const x1 = (-b + dSqrt) / a_2;
    const x2 = (-b - dSqrt) / a_2;

    return [x1, x2];
}