import { Circle } from "./Circles";

export class Task {
    constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        this._defualtContext = ctx;
        this._width = canvasWidth;
        this._height = canvasHeight;
    }

    start() {

        for (let i: number = 0; i < 3; i++) {
            this._circles.push(new Circle(this._defualtContext, 50, (150 * i) + 100, 50, this._color[i]));
        }

        this._circles[0].setIsMoving(true);
    }

    loop() {
        for (let i: number = 0; i < 3; i++) {
            const circle: Circle = this._circles[i];
            if (circle.isMoving()) {
                if (circle.getPositionX() + circle.getRaduis() < this._width &&
                    circle.getPositionY() + circle.getRaduis() < this._height) {
                    circle.moveToEnd(1, 0);
                } else {
                    circle.setIsMoving(false);
                    if (i < 2) {
                        this._circles[i + 1].setIsMoving(true);
                    }
                }
            } else {
                circle.draw();
            }

        }
    }

    private _defualtContext: CanvasRenderingContext2D;
    private _width: number;
    private _height: number;
    private _circles: Circle[] = [];

    private _color: string [] = ["green","red", "blue"]
}
