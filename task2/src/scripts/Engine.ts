import { glMatrix, mat4 } from "gl-matrix";
import { IndexBuffer } from "./Core/IndexBuffer";
import { ShaderProgram } from "./Core/ShaderProgram";
import { VertexBuffer } from "./Core/VertexBuffer";

export let glContext: WebGLRenderingContext;
export class Engine {
    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        this._height = height;
        this._width = width;
        this._canvas = canvas;
        this.setGlContext();
        this.resize();
        window.addEventListener("resize", this.resize.bind(this));
        glContext.viewport(0, 0, this._canvas.width, this._canvas.height);
    }


    setGlContext() {
        glContext = this._canvas.getContext("webgl") as WebGLRenderingContext;
    }

    resize() {
        if (this._canvas) {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
            glContext.viewport(0, 0, this._canvas.width, this._canvas.height);

        }
    }

    start() {
        glContext.clearColor(0, 0, 0, 1);
        // this.task.start();
        this.loadShaders();
        this.createBuffer();
        this._shaderProgram.useShader();
        this.loop();
    }


    loop() {
        glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
        glContext.enable(glContext.DEPTH_TEST);
        glContext.enable(glContext.CULL_FACE);
        glContext.frontFace(glContext.CCW);
        glContext.cullFace(glContext.BACK);
        this._indexBuffer.bindBuffer();

        // adding position to respective attributes
        const positionAttribLocation = this._shaderProgram.getAttribLocation("a_position")
        glContext.vertexAttribPointer(positionAttribLocation, 3, glContext.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
        glContext.enableVertexAttribArray(positionAttribLocation);

        // adding color to respective attributes
        const colorAttribLocation = this._shaderProgram.getAttribLocation('a_color');
        glContext.vertexAttribPointer(colorAttribLocation, 3, glContext.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        glContext.enableVertexAttribArray(colorAttribLocation);

        const angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(this.yRotationMatrix, this.identityMatrix, angle, [0, 1, 0]);
        mat4.rotate(this.xRotationMatrix, this.identityMatrix, angle /4, [1, 0, 0]);
        mat4.mul(this.worldMatrix,this.yRotationMatrix, this.xRotationMatrix);
        glContext.uniformMatrix4fv(this._shaderProgram.getUniformLocation("mWorld"), false, this.worldMatrix)
        glContext.drawElements(glContext.TRIANGLES,this.boxIndices.length, glContext.UNSIGNED_SHORT, 0);
        // this.task.loop();
        requestAnimationFrame(this.loop.bind(this));
    }


    private loadShaders() {
        const vertexShaderSource: string =
            `
        attribute vec3 a_position;
        attribute vec3 a_color;
        varying vec3  fragColor;
        uniform mat4 mWorld;
        uniform mat4 mView;
        uniform mat4 mProjection;
        void main() {
            gl_Position = mProjection * mView * mWorld * vec4(a_position, 1.0);
            fragColor = a_color;
        }`

        const fragmentShaderSource: string =
            `
            precision mediump float;
            varying vec3  fragColor;
        void main() {
            gl_FragColor = vec4(fragColor, 1.0);
        }`

        this._shaderProgram = new ShaderProgram("fistShader", vertexShaderSource, fragmentShaderSource);
    }

    private createBuffer() {
        // Create and store data into vertex buffer
        const  boxVertices = 
        [ // X, Y, Z           R, G, B
            // Top
            -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
            -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
            1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
            1.0, 1.0, -1.0,    0.5, 0.5, 0.5,
    
            // Left
            -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
            -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
            -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
            -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,
    
            // Right
            1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
            1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
            1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
            1.0, 1.0, -1.0,   0.25, 0.25, 0.75,
    
            // Front
            1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
            1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
            -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
            -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
    
            // Back
            1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
            1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
            -1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
            -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
    
            // Bottom
            -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
            -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
            1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
            1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
        ];

         this.boxIndices =
        [
            // Top
            0, 1, 2,
            0, 2, 3,
    
            // Left
            5, 4, 6,
            6, 4, 7,
    
            // Right
            8, 9, 10,
            8, 10, 11,
    
            // Front
            13, 12, 14,
            15, 14, 12,
    
            // Back
            16, 17, 18,
            16, 18, 19,
    
            // Bottom
            21, 20, 22,
            22, 20, 23
        ];


        this._vertexBuffer = new VertexBuffer(boxVertices);
        this._indexBuffer = new IndexBuffer(this.boxIndices);
        this.bindUniforms();

    }


    private bindUniforms() {
        const matWorldUniformLocation = this._shaderProgram.getUniformLocation('mWorld');
        const matViewdUniformLocation = this._shaderProgram.getUniformLocation('mView');
        const matProjectionUniformLocation = this._shaderProgram.getUniformLocation('mProjection');
        this._shaderProgram.useShader();

        this.worldMatrix = new Float32Array(16);
        this.viewMatrix = new Float32Array(16);
        this.projectionMatrix = new Float32Array(16);

        mat4.identity(this.worldMatrix);
        mat4.lookAt(this.viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
        mat4.identity(this.projectionMatrix);
        mat4.perspective(this.projectionMatrix, glMatrix.toRadian(45), this._canvas.width / this._canvas.height, 0.1, 1000.0);
        glContext.uniformMatrix4fv(matWorldUniformLocation, false, this.worldMatrix);
        glContext.uniformMatrix4fv(matViewdUniformLocation, false, this.viewMatrix);
        glContext.uniformMatrix4fv(matProjectionUniformLocation, false, this.projectionMatrix);

        this.xRotationMatrix = new Float32Array(16);
        this.yRotationMatrix = new Float32Array(16);
        this.identityMatrix = new Float32Array(16);
        mat4.identity(this.identityMatrix);
    }

    private _width: number;
    private _height: number;
    private _canvas: HTMLCanvasElement;
    private _shaderProgram: ShaderProgram;
    private _vertexBuffer: VertexBuffer;
    private _indexBuffer: IndexBuffer;

    private xRotationMatrix: Float32Array;
    private yRotationMatrix: Float32Array; 
    private identityMatrix: Float32Array;

    private worldMatrix: mat4;
    private viewMatrix: mat4;
    private projectionMatrix: mat4;
    private boxIndices: number [];


}