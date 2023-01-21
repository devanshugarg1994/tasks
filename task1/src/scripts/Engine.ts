import { Task } from "./Task";

export class Engine {
    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        this._height = height;
        this._width = width;
        this._ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.task = new Task(this._ctx, this._width, this._height);

    }

    start() {
        this.task.start();
        this.loop();
    }


    loop() {
        this._ctx.clearRect(0, 0, this._width, this._height);
        this.task.loop();
        requestAnimationFrame(this.loop.bind(this));
    }

    private _ctx: CanvasRenderingContext2D;
    private _width: number;
    private _height: number;

    private task: Task;
}