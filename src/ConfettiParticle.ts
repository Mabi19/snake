import { Vector } from "./Vector";
import {
    scaleQuaternion,
    Quaternion,
    randomUnitQuaternion,
    randomPointOnSphere,
    normalizeQuaternion,
    addQuaternions,
    hamiltonProduct,
    rotatePoint,
} from "./quaternion";

function clamp(min: number, x: number, max: number) {
    return Math.min(Math.max(min, x), max);
}

const confettiVerts = [
    new Vector(-0.005, -0.008),
    new Vector(0.005, -0.008),
    new Vector(0.005, 0.008),
    new Vector(-0.005, 0.008),
];

const LIFESPAN = 10;

const CONFETTI_SPREAD_ANGLE = Math.PI / 3;

export class ConfettiParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;

    orientation: Quaternion;
    angularVelocity: Quaternion;

    age: number;
    hue: number;

    constructor() {
        this.x = 0.4 + Math.random() * 0.2;
        this.y = 0.8 + Math.random() * 0.2;

        const velMult = 0.3 + Math.random() * 1.3;
        const velAngle = (Math.random() - 0.5) * CONFETTI_SPREAD_ANGLE;
        this.vx = Math.sin(velAngle) * 0.01 * velMult;
        this.vy = -Math.cos(velAngle) * 0.01 * velMult;

        this.orientation = randomUnitQuaternion();
        this.angularVelocity = scaleQuaternion(
            { w: 0, ...randomPointOnSphere() },
            5 + Math.random() * 3
        );

        this.age = 0;
        this.hue = Math.floor(Math.random() * 10) * 36;
    }

    process(deltaTime: number) {
        this.age += deltaTime;
        this.x += this.vx;
        this.y += this.vy;

        this.vx -= 3 * deltaTime * this.vx;
        this.vy -= 3 * deltaTime * this.vy;

        // gravity
        this.vy += 0.0015 * deltaTime;

        // https://gamedev.stackexchange.com/questions/108920/applying-angular-velocity-to-quaternion
        this.orientation = normalizeQuaternion(
            addQuaternions(
                this.orientation,
                hamiltonProduct(
                    scaleQuaternion(this.angularVelocity, deltaTime / 2),
                    this.orientation
                )
            )
        );

        return this.age > LIFESPAN;
    }

    transformVert(vert: Vector, sizeInfo: Vector) {
        // rotate
        const rotated = rotatePoint(vert, this.orientation);

        // scale and translate
        // transform vert offsets by the height always, but positions by width/height
        return {
            x: rotated.x * sizeInfo.y + this.x * sizeInfo.x,
            y: rotated.y * sizeInfo.y + this.y * sizeInfo.y,
        };
    }

    draw(ctx: CanvasRenderingContext2D, sizeInfo: Vector) {
        ctx.fillStyle = `hsla(${this.hue}deg, 100%, 60%, ${
            clamp(0, LIFESPAN - this.age, 1.75) / 2
        })`;
        ctx.beginPath();
        const firstVert = this.transformVert(confettiVerts[0], sizeInfo);
        // console.log(firstVert);
        ctx.moveTo(firstVert.x, firstVert.y);

        for (const vert of confettiVerts.slice(1)) {
            const transformedVert = this.transformVert(vert, sizeInfo);

            ctx.lineTo(transformedVert.x, transformedVert.y);
        }
        ctx.fill();
    }
}
