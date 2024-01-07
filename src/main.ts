import "./style.css";
import { TableRenderer } from "./Renderer";
import { Vector } from "./Vector";

// TODO:
// - grace move
// - fruit
// - dynamic game settings

const TICK_LENGTH = 250;
let lastTick = performance.now();

const renderer = new TableRenderer();

const snake = [new Vector(2, 0), new Vector(1, 0), new Vector(0, 0)];
let direction = new Vector(0, 0);
let directionBuffer: Vector[] = [];

// initial render
renderer.render(snake, []);

function runTick() {
    // process inputs
    if (directionBuffer.length > 0) {
        direction = directionBuffer.shift()!;
    }

    // if snake is not moving, skip
    if (direction.x == 0 && direction.y == 0) {
        return;
    }

    // add head and remove tail
    const newHead = snake[0].add(direction);
    snake.unshift(newHead);
    snake.pop();

    renderer.render(snake, []);
}

function gameLoop() {
    const time = performance.now();
    const timeSinceLastTick = time - lastTick;
    if (timeSinceLastTick >= TICK_LENGTH) {
        lastTick = time;
        runTick();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
window.addEventListener("keydown", (ev) => {
    // write to newDirection to be able to check turnaround
    // with multiple inputs per tick
    // (and input buffering)

    // only allow buffering 1 input
    if (directionBuffer.length >= 2) {
        directionBuffer.pop();
    }

    const lastDir = directionBuffer.at(-1) ?? direction;

    switch (ev.key.toLowerCase()) {
        case "arrowleft":
        case "a":
            if (lastDir.x != 1) {
                directionBuffer.push(new Vector(-1, 0));
            }
            break;
        case "arrowup":
        case "w":
            if (lastDir.y != 1) {
                directionBuffer.push(new Vector(0, -1));
            }
            break;
        case "arrowright":
        case "d":
            if (lastDir.x != -1) {
                directionBuffer.push(new Vector(1, 0));
                break;
            }
            break;
        case "arrowdown":
        case "s":
            if (lastDir.y != -1) {
                directionBuffer.push(new Vector(0, 1));
            }
            break;
    }
});
