import { TableRenderer } from "./Renderer";
import { Vector, vectorInArray } from "./Vector";
import { Controls } from "./controls";
import { settings } from "./settings";

export class Game {
    snake: Vector[] = [];
    direction = new Vector(0, 0);
    directionBuffer: Vector[] = [];
    fruit: Vector[] = [];
    active = false;

    controls: Controls;
    renderer: TableRenderer;

    constructor(controls: Controls, renderer: TableRenderer) {
        this.controls = controls;
        this.renderer = renderer;
    }

    setup() {
        this.snake = [new Vector(2, 0), new Vector(1, 0), new Vector(0, 0)];
        this.direction = new Vector(0, 0);
        this.directionBuffer = [];
        this.fruit = [];
        this.spawnFruit();

        // initial render
        this.renderer.render(this.snake, this.fruit);

        this.active = true;
        this.controls.setActive(!this.active);
    }

    runTick() {
        // do nothing when the game is off
        if (!this.active) {
            return;
        }

        // process inputs
        if (this.directionBuffer.length > 0) {
            this.direction = this.directionBuffer.shift()!;
        }

        // if snake is not moving, skip
        if (this.direction.x == 0 && this.direction.y == 0) {
            return;
        }

        // add head and remove tail
        const newHead = this.snake[0].add(this.direction);

        if (vectorInArray(this.snake, newHead)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(newHead);
        if (!vectorInArray(this.fruit, newHead)) {
            this.snake.pop();
        } else {
            // delete the fruit
            this.fruit = this.fruit.filter((pos) => !(pos.x == newHead.x && pos.y == newHead.y));
            this.spawnFruit();
        }

        this.renderer.render(this.snake, this.fruit);
    }

    private spawnFruit() {
        const takenTiles = this.snake.concat(this.fruit);
        const freeTiles = [];
        for (let testX = 0; testX < settings.boardSize.x; testX++) {
            for (let testY = 0; testY < settings.boardSize.y; testY++) {
                const pos = new Vector(testX, testY);
                if (!vectorInArray(takenTiles, pos)) {
                    freeTiles.push(pos);
                }
            }
        }
        // When there are not enough tiles to spawn fruit, don't spawn it.
        const fruitToSpawn = Math.min(settings.fruitCount - this.fruit.length, freeTiles.length);
        for (let i = 0; i < fruitToSpawn; i++) {
            const tileIndex = Math.floor(Math.random() * freeTiles.length);
            const [tile] = freeTiles.splice(tileIndex, 1);
            this.fruit.push(tile);
        }
    }

    private gameOver() {
        this.active = false;
        this.controls.setActive(!this.active);
    }

    handleInput(ev: KeyboardEvent) {
        // write to newDirection to be able to check turnaround
        // with multiple inputs per tick
        // (and input buffering)

        // only allow buffering 1 input
        if (this.directionBuffer.length >= 2) {
            this.directionBuffer.pop();
        }

        const lastDir = this.directionBuffer.at(-1) ?? this.direction;

        switch (ev.key.toLowerCase()) {
            case "arrowleft":
            case "a":
                if (lastDir.x != 1 && lastDir.x != -1) {
                    this.directionBuffer.push(new Vector(-1, 0));
                }
                break;
            case "arrowup":
            case "w":
                if (lastDir.y != 1 && lastDir.y != -1) {
                    this.directionBuffer.push(new Vector(0, -1));
                }
                break;
            case "arrowright":
            case "d":
                if (lastDir.x != -1 && lastDir.x != 1) {
                    this.directionBuffer.push(new Vector(1, 0));
                    break;
                }
                break;
            case "arrowdown":
            case "s":
                if (lastDir.y != -1 && lastDir.y != 1) {
                    this.directionBuffer.push(new Vector(0, 1));
                }
                break;
        }

        document.querySelector("#debug")!.textContent = JSON.stringify(this.directionBuffer);
    }
}
