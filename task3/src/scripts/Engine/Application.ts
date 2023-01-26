import { Assets } from "../Assets";
import { Performance } from "../assignment/Performance";
import { LoadingUI } from "../assignment/LoadingUI";
import { MainScene } from "../assignment/MainScene";
import { Container } from "../UiComponent/Container";

/* 
* It is class whose instance is treated as gameObject of the Game
* It allow us to add compoenet on stage,
* It allow to load media (All asynchronous are take care internally by PIXI).
* It also contain the _app object.
*/
export class Application {

    public _app: PIXI.Application;
    public stage: PIXI.Container;
    public loader: PIXI.Loader;

    constructor() {
        const resolution: number = window.devicePixelRatio;
        this._app = new PIXI.Application({
            autoStart: true,
            autoDensity: true,
            antialias: false,
            resolution: resolution,
            backgroundColor: 0xFFFFFF,
            resizeTo: window,
            // Canvas Size
            width: 360,
            height: 640,
        });


        document.body.appendChild(this._app.view);
        window.addEventListener("resize", () => {
            this._app.renderer.resize(window.innerWidth, window.innerHeight);
        });
        this.stage = this._app.stage;
        this.loader = this._app.loader;

    }

    getFPS(): number {
        return this._app.ticker.FPS;
    }

    getStageRefrence(): PIXI.Container {
        return this.stage;
    }

    getLoaderRefrence(): PIXI.Loader {
        return this.loader

    }

    public scheduleTaskOnce(timeInSec: number, callback: Function) {
        let seconds = 0;
        const timer = (delta: number) => {
            seconds += (1 / 60) * delta;
            if (seconds >= timeInSec) {
                callback && callback();
                this._app.ticker.remove(timer);
            }
        }
        this._app.ticker.add(timer);
    }

    public scheduleTask(key: string, timeInSec: number, callback: Function) {
        let seconds = 0;
        const timer = (delta: number) => {
            seconds += (1 / 60) * delta;
            if (seconds >= timeInSec) {
                callback && callback();
                seconds = 0
            }
        }
        this.scheduledTask[key] = timer;
        this._app.ticker.add(timer);
    }

    public tweenMove<T extends Container>(timeInSec: number, propertyTargetValue: PIXI.Point, callback: Function, obj: T) {
        let seconds = 0;
        let fraction;
        const startPointX  =  obj.x;
        const startPointY  =  obj.y;

        this.tweenUpdate = (delta: number) => {
            seconds += (1 / 60) * delta;

            if (seconds >= timeInSec) {
                this._app.ticker.remove(this.tweenUpdate);
                seconds = 0;
                callback && callback();
            } else {
                fraction = seconds / timeInSec;
                obj.x = lerp(startPointX, propertyTargetValue.x, fraction);
                obj.y = lerp(startPointY, propertyTargetValue.y, fraction);

            }
        }
        this._app.ticker.add(this.tweenUpdate);

    }
    

    public removeTween() {
        this._app.ticker.remove(this.tweenUpdate);
    }

    public init(): void {
        this.loadingUI = new LoadingUI(this.loader.resources[Assets.LoadingUiPath]?.data.loading);
        const performance = new Performance(this.loader.resources[ Assets.getInstance().getRelativePath("performance")]?.data.performance);
        this.stage.addChild(this.loadingUI);
        this.stage.addChild(performance);
        this.scheduleTaskOnce(3, () => {
            this.stage.removeChild(this.loadingUI);
            const mainScene: MainScene = new MainScene(this.loader.resources[ Assets.getInstance().getRelativePath("mainScene")]?.data.mainScene);
        });
    };

    removeScheduledTask(key: string) {
        const fun = this.scheduledTask[key];
        this._app.ticker.remove(fun);

    }
    
    private tweenUpdate: any;
    private scheduledTask:  { [key: string]: any } = {};
    private loadingUI!: LoadingUI;
}



export function lerp(a: number, b: number, fraction: number) {
    fraction = fraction < 0 ? 0 : fraction;
    fraction = fraction > 1 ? 1 : fraction;
    return a + (b - a) * fraction;
}

export function isMobile() {
    return PIXI.utils.isMobile.any && window.innerHeight > window.innerWidth;
}
