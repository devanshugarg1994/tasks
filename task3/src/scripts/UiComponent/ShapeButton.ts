import { Container } from "./Container";
import { Label } from "./Label";
import { Shape } from "./Shape";
export class ShapeButton extends Container {

    constructor(json: any) {
        super(json);
        this.x = json.x;
        this.y = json.y;
        json.pivot && (this.pivot.set(json.pivot, json.pivot));
        (json.pivotX && json.pivotY) && (this.pivot.set(json.pivotX, json.pivotY));
        if(typeof json.visible === "boolean") {
            this.visible = json.visible;
        }
        this.shape = new Shape(json.shape);
        this.shape.createShape(json.shape);
        this.shape.buttonMode = true;
        this.shape.interactive = true;

        this.label = new Label(json.label);
        this.addChild(this.shape);
        this.addChild(this.label);
    }


    protected shape: Shape;
    protected label: Label
}