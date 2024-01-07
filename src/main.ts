import "./style.css";
import { TableRenderer } from "./Renderer";
import { settings } from "./settings";
import { handleInput, runTick, setup } from "./game";

// TODO:
// - collision
// - grace move
// - customization: outside walls, fruit count, board size, tick speed
// - scoring, high scores (yoink confetti effect)

let lastTick = performance.now();

const renderer = new TableRenderer();

function gameLoop() {
    const time = performance.now();
    const timeSinceLastTick = time - lastTick;
    if (timeSinceLastTick >= settings.tickLength) {
        lastTick = time;
        runTick(renderer);
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (ev) => {
    handleInput(ev);
});

setup(renderer);
gameLoop();
