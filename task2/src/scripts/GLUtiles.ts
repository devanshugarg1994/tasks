export class GLUtiles {
    static getCanvasElement(canavsID: string, createNew: boolean = false): HTMLCanvasElement {
        let canvas!: HTMLCanvasElement;
        if (canavsID && !createNew) {
            canvas = document.getElementById(canavsID) as HTMLCanvasElement;
            if(!canvas) {
                throw new Error("Not able to find canavs Element");
            }
        } else {
            canvas = document.createElement(canavsID) as HTMLCanvasElement;
            document.appendChild(canvas);
        }
        return canvas;
    }
}