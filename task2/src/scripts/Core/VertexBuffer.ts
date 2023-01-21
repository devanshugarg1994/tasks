import { glContext } from "../Engine";

export class VertexBuffer {
    constructor(data: number[]) {
        this._buffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this._buffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(data), glContext.STATIC_DRAW);
    }

    deleteBuffer() {
        glContext.deleteBuffer(this._buffer);
    }

    bindBuffer() {
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this._buffer);
    }

    unBindBuffer() {
        glContext.bindBuffer(glContext.ARRAY_BUFFER, 0);
    }


    private _buffer: WebGLBuffer;
}