/* 
* This is the Class soley Responsible for creating Ui Component like: animation, Container
* Label etc..
* All function  are static in the class hence we do not create instace of the FactoryUI '
* Class. This is inspried by `Simple Factory Design Pattern`
* When we create instance of  View we created json is passed through constructor 
* to Parent class : `BasicNode` which call 
* FactoryUI by passing the json which conatin all object needed to create in the View
* and here all component are created by tranversing that JSON.
*/

import { Container } from "./Container";
import { Label } from "./Label";
import { BasicNode } from "./BasicNode";
import { Shape } from "./Shape";
import { ShapeButton } from "./ShapeButton";


export class FactoryUI {
    static createUI(json: any, view: BasicNode): void {
        for (const element in json) {
            const obj = json[element]
            switch (obj.type.toLowerCase()) {
                case "label":
                    this.createLabel(obj, view);
                    break;
                case "container":
                    this.createContainer(obj, view);
                    break;
                case "shape":
                    this.createShape(obj, view);
                    break;
                case "shapebutton":
                    this.createshapeButton(obj, view);
                    break;
                case "custom":
                    break;
            }
        }
    }

    static createLabel(json: any, view: BasicNode): void {
        const label: Label = new Label(json);
        if (json.parent) {
            view.getContainerRefrences(json.parent).addChild(label);
        } else {
            view.addChild(label);
        }
        view.setLabelRefrences(json.id, label);
    }

    static createshapeButton(json: any, view: BasicNode): void {
        const button: ShapeButton = new ShapeButton(json);
        if (json.parent) {
            view.getContainerRefrences(json.parent).addChild(button);
        } else {
            view.addChild(button);
        }
        view.setShapeButtonRefrences(json.id, button);
    }

    static createContainer(json: any, view: BasicNode): void {
        const container: Container = new Container(json);
        if (json.parent) {
            view.getContainerRefrences(json.parent).addChild(container);
        } else {
            view.addChild(container);
        }
        view.setContainerRefrences(json.id, container);

    }


    static createShape(json: any, view: BasicNode): Shape {
        const gfx: Shape = new Shape(json);
        gfx.createShape(json);
        if (!json.visible) {
            gfx.visible = true;
        }
        if (json.scale) {
            gfx.scale.set(json.scale, json.scale);
        }
        if (json.parent) {
            view.getContainerRefrences(json.parent).addChild(gfx);
        } else {
            view.addChild(gfx);
        }
        view.setShapeRefrences(json.id, gfx);

        return gfx;
    }
}