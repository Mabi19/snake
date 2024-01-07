import { Vector } from "./Vector";

export interface GameSettings {
    tickLength: number;
    boardSize: Vector;
    fruitCount: number;
}

export const settings: GameSettings = {
    tickLength: 250,
    boardSize: new Vector(10, 10),
    fruitCount: 1,
};
