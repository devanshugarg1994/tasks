import { Engine } from "./Engine";
import { GLUtiles } from "./Core/GLUtiles";

export let canvas : HTMLCanvasElement;
canvas = GLUtiles.getCanvasElement("gameCanvas");
const engine : Engine = new Engine(canvas, 1280, 720);
engine.start();