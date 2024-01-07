import { TableRenderer } from "./Renderer";
import { Vector, vectorInArray } from "./Vector";
import { controls } from "./controls";
import { settings } from "./settings";

let snake: Vector[] = [];
let direction = new Vector(0, 0);
let directionBuffer: Vector[] = [];
let fruit: Vector[] = [];
let gameActive = false;

export function setup(renderer: TableRenderer) {
    snake = [new Vector(2, 0), new Vector(1, 0), new Vector(0, 0)];
    direction = new Vector(0, 0);
    directionBuffer = [];
    fruit = [];
    spawnFruit();

    // initial render
    renderer.render(snake, fruit);

    gameActive = true;
    controls.setActive(!gameActive);
}

export function handleInput(ev: KeyboardEvent) {
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
            if (lastDir.x != 1 && lastDir.x != -1) {
                directionBuffer.push(new Vector(-1, 0));
            }
            break;
        case "arrowup":
        case "w":
            if (lastDir.y != 1 && lastDir.y != -1) {
                directionBuffer.push(new Vector(0, -1));
            }
            break;
        case "arrowright":
        case "d":
            if (lastDir.x != -1 && lastDir.x != 1) {
                directionBuffer.push(new Vector(1, 0));
                break;
            }
            break;
        case "arrowdown":
        case "s":
            if (lastDir.y != -1 && lastDir.y != 1) {
                directionBuffer.push(new Vector(0, 1));
            }
            break;
    }

    document.querySelector("#debug")!.textContent = JSON.stringify(directionBuffer);
}

function spawnFruit() {
    const takenTiles = snake.concat(fruit);
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
    const fruitToSpawn = Math.min(settings.fruitCount - fruit.length, freeTiles.length);
    for (let i = 0; i < fruitToSpawn; i++) {
        const tileIndex = Math.floor(Math.random() * freeTiles.length);
        const [tile] = freeTiles.splice(tileIndex, 1);
        fruit.push(tile);
    }
}

function gameOver() {
    gameActive = false;
    controls.setActive(!gameActive);
}

export function runTick(renderer: TableRenderer) {
    // do nothing when the game is off
    if (!gameActive) {
        return;
    }

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

    if (vectorInArray(snake, newHead)) {
        gameOver();
        return;
    }

    snake.unshift(newHead);
    if (!vectorInArray(fruit, newHead)) {
        snake.pop();
    } else {
        // delete the fruit
        fruit = fruit.filter((pos) => !(pos.x == newHead.x && pos.y == newHead.y));
        spawnFruit();
    }

    renderer.render(snake, fruit);
}
