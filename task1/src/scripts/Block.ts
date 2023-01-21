export class Circle {
    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
        this._x = x;
        this._y = y;
        this._radius = radius;
        this._color = color;
        this._ctx = ctx;
    }


    draw() {
        this._ctx.beginPath();
        this._ctx.fillStyle = this._color;
        this._ctx.arc(this._x, this._y, this._radius, 0, Math.PI * 2, false);
        this._ctx.fill();
        this._ctx.closePath();
    }

    moveToEnd(deltaX: number, deltaY: number) {
        this._x += deltaX;
        this._y += deltaY;

        this.draw();
    }



    getPositionX() {
        return this._x;
    }

    getPositionY() {
        return this._y;
    }

    getRaduis() {
        return this._radius;
    }

    setIsMoving(value: boolean) {
        this._isMoving = value;
    }

    isMoving(): boolean {
        return this._isMoving;
    }

    setIsDestinationReached(value: boolean) {
        this._isDestinationReached = value;
    } 

    isDestinationReached() {
        return this._isDestinationReached;
    }




    private _x: number;
    private _y: number
    private _radius: number;
    private _color: string;
    private _ctx: CanvasRenderingContext2D;
    private _isMoving: boolean = false;
    private _isDestinationReached: boolean = false;
}