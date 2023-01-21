import { glContext } from "../Engine";

export class IndexBuffer {
    constructor(data: number[]) {

        this._buffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this._buffer);
        glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), glContext.STATIC_DRAW);
    }



    deleteBuffer() {
        glContext.deleteBuffer(this._buffer);
    }

    bindBuffer() {
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this._buffer);

    }

    unBindBuffer() {
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, 0);

    }


    private _buffer: WebGLBuffer
}