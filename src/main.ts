import "./style.css";
import { TableRenderer } from "./Renderer";
import { settings } from "./settings";
import { Game } from "./game";
import { Controls } from "./controls";

// TODO:
// - grace move
// - customization: outside walls, fruit count, board size, tick speed
// - game over overlay (yoink confetti effect)

let lastTick = performance.now();

const controls = new Controls();
const renderer = new TableRenderer();
const game = new Game(controls, renderer);

function gameLoop() {
    const time = performance.now();
    const timeSinceLastTick = time - lastTick;
    if (timeSinceLastTick >= settings.tickLength) {
        lastTick = time;
        game.runTick();
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (ev) => {
    game.handleInput(ev);
});

controls.setActive(true);
controls.onstart = () => {
    game.setup();
};
gameLoop();
