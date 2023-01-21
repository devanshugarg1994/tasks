export class GLUtiles {
    static getCanvasElement(canavsID: string,  createNew: boolean = false): HTMLCanvasElement {
        let canvas!: HTMLCanvasElement;
        if (canavsID && !createNew) {
             canvas = document.getElementById(canavsID) as HTMLCanvasElement;


        } else {
             canvas= document.createElement(canavsID) as HTMLCanvasElement;
            document.appendChild(canvas);
        }

        return canvas;
    }
}

