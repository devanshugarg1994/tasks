import { Engine } from "./Engine";
import { GLUtiles } from "./GLUtiles";

export let canvas : HTMLCanvasElement;
canvas = GLUtiles.getCanvasElement("gameCanvas");
const engine : Engine = new Engine(canvas, 500, 500);
engine.start();