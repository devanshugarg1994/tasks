import { findNeighboursSum, shuffleArray } from "../ArrayUtlis";

export class Task {
    constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        this._defualtContext = ctx;
        this._width = canvasWidth;
        this._height = canvasHeight;
    }

    init(resolution: number) {
        this._resolution = resolution;
        this.grid = this.createTwoDArray(this._width / this._resolution, this._height / this._resolution);
    }


    start() {
        this.draw();
    }



    loop() {
        this.draw();
        this.grid = this.updateGrid();
    }

    draw() {
        const rows: number = this._width / this._resolution;
        const columns: number = this._height / this._resolution;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const x = i * this._resolution;
                const y = j * this._resolution;
                if (this.grid[i][j]) {
                    this._defualtContext.beginPath();
                    this._defualtContext.fillStyle = "black";
                    this._defualtContext.fillRect(x, y, this._resolution, this._resolution);
                    this._defualtContext.fill();
                    this._defualtContext.closePath();
                }
            }
        }

    }

    updateGrid(): number[][] {
        const rows: number = this._width / this._resolution;
        const columns: number = this._height / this._resolution;
        const nextState = this.createTwoDArray(rows, columns);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let state = this.grid[i][j];
                // Count live neighbors!
                let sum = 0;
                let neighbors = findNeighboursSum(this.grid, i, j);

                if (state == 0 && neighbors == 3) {
                    nextState[i][j] = 1;
                } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                    nextState[i][j] = 0;
                } else {
                    nextState[i][j] = state;
                }

            }
        }

        return nextState;
    }

    createTwoDArray(rows: number, cloumn: number): number[][] {
        const arr: number[][] = [];
        for (let i = 0; i < rows; i++) {
            const row: number[] = [];
            arr.push(row);
            for (let j = 0; j < cloumn; j++) {
                row.push(Math.floor(Math.random() * 2))
            }
        }
        return arr;
    }



    private _defualtContext: CanvasRenderingContext2D;
    private _width: number;
    private _height: number;
    private grid: number[][] = [];
    private _resolution!: number;
}