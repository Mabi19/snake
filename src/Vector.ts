export class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        // make it immutable
        Object.freeze(this);
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    add(other: Vector) {
        return new Vector(this.x + other.x, this.y + other.y);
    }
}
