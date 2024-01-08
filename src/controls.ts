import { Vector } from "./Vector";
import { settings } from "./settings";

function select(id: string, handler: (v: string) => void) {
    const el = document.querySelector<HTMLSelectElement>(id)!;
    handler(el.value);
    el.addEventListener("change", () => handler(el.value));
}

function numberField(id: string, handler: (v: number) => void) {
    const el = document.querySelector<HTMLInputElement>(id)!;
    handler(parseInt(el.value));
    el.addEventListener("input", () => handler(parseInt(el.value)));
}

function checkbox(id: string, handler: (v: boolean) => void) {
    const el = document.querySelector<HTMLInputElement>(id)!;
    handler(el.checked);
    el.addEventListener("input", () => handler(el.checked));
}

const BOARD_SIZE_MAP = {
    tiny: new Vector(4, 4),
    small: new Vector(8, 8),
    medium: new Vector(12, 12),
    large: new Vector(15, 15),
    gigantic: new Vector(25, 25),
    enormous: new Vector(40, 40),
};

const TICK_LENGTH_MAP = {
    slow: 500,
    medium: 250,
    fast: 150,
};

export class Controls {
    wrapper = document.querySelector("#controls")!;
    startButton: HTMLButtonElement = document.querySelector("#start")!;
    onstart = () => {};
    onupdatesize = () => {};

    constructor() {
        this.setActive(false);
        this.startButton.addEventListener("click", () => this.onstart());

        select("#board-size", (v) => {
            settings.boardSize = BOARD_SIZE_MAP[v as keyof typeof BOARD_SIZE_MAP];
            this.onupdatesize();
        });

        select("#tick-length", (v) => {
            settings.tickLength = TICK_LENGTH_MAP[v as keyof typeof TICK_LENGTH_MAP];
        });

        numberField("#fruit-count", (v) => {
            settings.fruitCount = v;
        });

        checkbox("#wall-collision", (v) => {
            settings.collideWithWalls = v;
        });
    }

    setActive(val: boolean) {
        if (val) {
            this.wrapper.classList.remove("hidden");
        } else {
            this.wrapper.classList.add("hidden");
        }
    }
}
