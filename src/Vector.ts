export class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        // make it immutable
        Object.freeze(this);
    }

    add(other: Vector) {
        return new Vector(this.x + other.x, this.y + other.y);
    }
}

export function vectorInArray(arr: Vector[], vec: Vector) {
    return arr.find(({ x, y }) => vec.x == x && vec.y == y) !== undefined;
}
