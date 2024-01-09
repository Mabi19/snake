import "./style.css";
import { TableRenderer } from "./Renderer";
import { settings } from "./settings";
import { Game } from "./game";
import { Controls } from "./controls";
import { ConfettiContext } from "./ConfettiContext";

let lastTick = performance.now();

const controls = new Controls();
const renderer = new TableRenderer();
const confetti = new ConfettiContext();

const game = new Game(controls, renderer, confetti);

function gameLoop() {
    const time = performance.now();
    const timeSinceLastTick = time - lastTick;
    if (timeSinceLastTick >= settings.tickLength) {
        lastTick = time;
        game.runTick();
    }

    requestAnimationFrame(gameLoop);
}

const fruitCounter = document.querySelector<HTMLInputElement>("#fruit-count")!;

fruitCounter.addEventListener("input", () => {
    if (fruitCounter.valueAsNumber <= 0) {
        fruitCounter.valueAsNumber = 1;
    }
})


window.addEventListener("keydown", (ev) => {
    game.handleInput(ev);
});

controls.setActive(true);
controls.onstart = () => {
    game.setup();
};
controls.onupdatesize = () => {
    renderer.createPlayfield();
};
controls.onupdate = () => {
    game.updateScoreSource();
};

gameLoop();
