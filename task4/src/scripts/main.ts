import { Engine } from "./Engine";
import { GLUtiles } from "./GLUtiles";

export let canvas : HTMLCanvasElement;
canvas = GLUtiles.getCanvasElement("gameCanvas");
const engine : Engine = new Engine(canvas, 1000, 1000);
engine.start();