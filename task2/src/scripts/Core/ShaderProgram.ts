import { glContext } from "../Engine";

export class ShaderProgram {
    private static _Tag: string = "ShaderProgram"
    constructor(id: string, vertexShaderSource: string, fragmentShaderSource: string) {
        this.id = id;
        const vertexShader: WebGLShader = this.loadShader(vertexShaderSource, glContext.VERTEX_SHADER);
        const fragmentShader: WebGLShader = this.loadShader(fragmentShaderSource, glContext.FRAGMENT_SHADER);

        this.createProgram(vertexShader, fragmentShader);
        this.detactAttributes();
        this.detactUniform();

    }


    getShaderID(): string {
        return this.id;
    }

    useShader(): void {
        glContext.useProgram(this._program);
    }

    getAttribLocation(name: string): number {
        const location: number = this._attributes[name];
        if (typeof location !== "number") {
            throw new Error(`Error in finding location of attribute in ${ShaderProgram._Tag} of is id: ${this.id} 
                              while searching for attribute of name ${name}`)
        }
        return location;
    } 
    
    getUniformLocation(name: string): WebGLUniformLocation {
        const location: WebGLUniformLocation = this._uniforms[name];
        // if (typeof location !== "number") {
        //     throw new Error(`Error in finding location of attribute in ${Shader._Tag} of is id: ${this.id} 
        //                       while searching for attribute of name ${name}`)
        // }
        return location;
    }


    private loadShader(source: string, shaderType: number): WebGLShader {
        const shader: WebGLShader = glContext.createShader(shaderType) as WebGLShader;
        glContext.shaderSource(shader, source);
        glContext.compileShader(shader);

        const error: string = glContext.getShaderInfoLog(shader) as string;
        if (error) {
            throw new Error(`Error in compiling shader in : ${ShaderProgram._Tag} id: ${this.id} and the error is ${error}`);
        }

        return shader;
    }

    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
        this._program = glContext.createProgram() as WebGLProgram;
        glContext.attachShader(this._program, vertexShader);
        glContext.attachShader(this._program, fragmentShader);
        glContext.linkProgram(this._program);

        const error: string = glContext.getProgramInfoLog(this._program) as string;
        if (error) {
            throw new Error(`Error in linking program ${ShaderProgram._Tag} id: ${this.id} ErrorL ${error}`)
        }
    }

    private detactAttributes(): void {
        const attributeCount = glContext.getProgramParameter(this._program, glContext.ACTIVE_ATTRIBUTES);
        for (let attribute: number = 0; attribute < attributeCount; attribute++) {
            const attributeInfo = glContext.getActiveAttrib(this._program, attribute);
            if (!attributeInfo) {
                break;
            }

            this._attributes[attributeInfo.name] = glContext.getAttribLocation(this._program, attributeInfo.name);
        }

        console.log(this._attributes);
    }  
    
    private detactUniform(): void {
        const uniformCount = glContext.getProgramParameter(this._program, glContext.ACTIVE_UNIFORMS);
        for (let uniform: number = 0; uniform < uniformCount; uniform++) {
            const uniformInfo = glContext.getActiveUniform(this._program, uniform);
            if (!uniformInfo) {
                break;
            }

            this._uniforms[uniformInfo.name] = glContext.getUniformLocation(this._program, uniformInfo.name);
        }

        console.log(this._uniforms);
    }


    private id: string;
    private _program!: WebGLProgram;
    private _attributes: { [id: string]: number } = {};
    private _uniforms: { [id: string]: WebGLUniformLocation } = {};
}