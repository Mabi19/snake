import "./style.css";
import { TableRenderer } from "./Renderer";
import { Vector } from "./Vector";

// TODO:
// - grace move
// - input buffering
// - fruit
// - dynamic game settings

const TICK_LENGTH = 250;
let lastTick = performance.now();

const renderer = new TableRenderer();

const snake = [new Vector(2, 0), new Vector(1, 0), new Vector(0, 0)];
let direction = new Vector(0, 0);
let newDirection = new Vector(0, 0);

// initial render
renderer.render(snake, []);

function runTick() {
    // if snake is not moving, skip
    direction = newDirection;

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
    switch (ev.key.toLowerCase()) {
        case "arrowleft":
        case "a":
            if (direction.x != 1) {
                newDirection = new Vector(-1, 0);
            }
            break;
        case "arrowup":
        case "w":
            if (direction.y != 1) {
                newDirection = new Vector(0, -1);
            }
            break;
        case "arrowright":
        case "d":
            if (direction.x != -1) {
                newDirection = new Vector(1, 0);
                break;
            }
            break;
        case "arrowdown":
        case "s":
            if (direction.y != -1) {
                newDirection = new Vector(0, 1);
            }
            break;
    }
});
