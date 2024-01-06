import { Vector } from "./Vector";
import "./table.css";

export class TableRenderer {
    playfield: HTMLDivElement;
    cells: HTMLDivElement[][] = [];
    lastSnake: Vector[] = [];
    lastFruit: Vector[] = [];

    createPlayfield(width: number, height: number) {
        this.playfield.replaceChildren();
        this.playfield.style.setProperty("--board-width", `${width}`);

        for (let y = 0; y < height; y++) {
            const rowElem = document.createElement("div");
            rowElem.classList.add("table-row");
            const row: HTMLDivElement[] = [];
            for (let x = 0; x < width; x++) {
                const cell = document.createElement("div");
                cell.classList.add("table-cell");
                rowElem.appendChild(cell);
                row.push(cell);
            }
            this.playfield.appendChild(rowElem);
            this.cells.push(row);
        }
    }

    constructor() {
        this.playfield = document.querySelector("#playfield")!;
        this.createPlayfield(10, 10);
    }

    render(snake: Vector[], fruit: Vector[]) {
        // reset fruit
        for (const oldFruit of this.lastFruit) {
            this.cells[oldFruit.y][oldFruit.x].classList.remove("fruit");
        }
        for (const newFruit of fruit) {
            this.cells[newFruit.y][newFruit.x].classList.add("fruit");
        }

        // snake: remove tail, add head
        // but if the length has changed, redraw fully
        if (this.lastSnake.length == snake.length) {
            const removeCell = this.lastSnake[this.lastSnake.length - 1];
            this.cells[removeCell.y][removeCell.x].classList.remove("snake");
            const newCell = snake[0];
            this.cells[newCell.y][newCell.x].classList.add("snake");
        } else {
            for (const oldSnakePiece of this.lastSnake) {
                this.cells[oldSnakePiece.y][oldSnakePiece.x].classList.remove("snake");
            }
            for (const newSnakePiece of snake) {
                this.cells[newSnakePiece.y][newSnakePiece.x].classList.add("snake");
            }
        }

        // copy to not override stuff
        this.lastSnake = snake.slice(0);
        console.assert(this.lastSnake != snake);
        this.lastFruit = fruit;
    }
}
