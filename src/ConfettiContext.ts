import { ConfettiParticle } from "./ConfettiParticle";
import { Vector } from "./Vector";

// Stolen from one of my other projects, the Stardew Perfection Randomizer.
export class ConfettiContext {
    canvas: HTMLCanvasElement;
    draw: CanvasRenderingContext2D;

    sizeInfo: Vector;
    particles: ConfettiParticle[];

    lastTick: number;
    isTicking: boolean;

    challengeFinishPercent: number;

    constructor() {
        this.canvas = document.querySelector<HTMLCanvasElement>("#confetti")!;
        this.draw = this.canvas.getContext("2d")!;

        // @ts-ignore
        this.sizeInfo = {};
        this.particles = [];
        this.lastTick = performance.now();
        this.isTicking = false;

        this.challengeFinishPercent = 0.5;

        const resizeObserver = new ResizeObserver((_entries) => {
            this.recalculatePositions();
        });
        resizeObserver.observe(this.canvas);
        this.recalculatePositions();
    }

    recalculatePositions() {
        console.log("recalculating");

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.sizeInfo.x = this.canvas.clientWidth;
        this.sizeInfo.y = this.canvas.clientHeight;
    }

    aspectRatio() {
        return this.sizeInfo.x / this.sizeInfo.y;
    }

    startTicking() {
        if (!this.isTicking) {
            this.isTicking = true;
            this.lastTick = performance.now();
            this.tick();
        }
    }

    tick() {
        const currentTime = performance.now();

        this.process((currentTime - this.lastTick) / 1000);
        this.render();

        this.lastTick = currentTime;

        // only redo when necessary
        requestAnimationFrame(() => {
            if (this.particles.length) {
                this.tick();
            } else {
                this.isTicking = false;
            }
        });
    }

    process(deltaTime: number) {
        //* This function has side effects, but doing this without filter() is very clunky
        this.particles = this.particles.filter((particle) => !particle.process(deltaTime));
    }

    render() {
        this.draw.clearRect(0, 0, this.sizeInfo.x, this.sizeInfo.y);

        for (const particle of this.particles) {
            particle.draw(this.draw, this.sizeInfo);
        }
    }

    spawnConfetti() {
        const COUNT = 250;

        for (let i = 0; i < COUNT; i++) {
            this.particles.push(new ConfettiParticle());
        }

        this.startTicking();
    }
}
