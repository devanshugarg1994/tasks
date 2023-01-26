import { Assets } from "../Assets";
import { Loader } from "../Engine/Loader";
import { game } from "../main";
import { BasicNode } from "../UiComponent/BasicNode";
import { BetController } from "./bet/BetController";
import { BetView } from "./bet/BetView";
import { BettingAreaController } from "./bettingArea/BettingAreaController";
import { BettingAreaView } from "./bettingArea/BettingAreaView";
import { CardDeckController } from "./cards/CardDeckController";
import { CardDeckView } from "./cards/CardDeckView";
import { CustomEventConstant } from "./constants/EventConstant";
import { GameModel } from "./GameModel";
import { GameMetersController } from "./meter/GameMetersController";
import { GameMetersView } from "./meter/GameMetersView";


export class MainScene extends BasicNode {
    constructor(json: any) {
        super(json);
        this.gameModel = new GameModel; // Composing insted of injecting because MainScene is entry point of our actual game logic
        this.loadCards();
    }
    // Dynamic Loading of assest(On demand example) 
    private loadCards() {
        window.dispatchEvent(new CustomEvent(CustomEventConstant.SHOW_LOADING_SCREEN));
        const cards: string[] = [];
        for (let i: number = 1; i <= 52; i++) {
            cards.push("../images/cards/card" + i + ".png");
        }
        Loader.loadDynamic(cards, (this.init.bind(this)));
    }


    private init() {
        game.stage.addChildAt(this, 0);
        window.dispatchEvent(new CustomEvent(CustomEventConstant.HIDE_LOADING_SCREEN));

        this.initBetComponent();
        this.initBettingAreaComponent();
        this.initgameMeterComponenets();
        this.initCardDeckComponents();
    }

    private initBetComponent() {
        this.betView = new BetView(game.loader.resources[Assets.getInstance().getRelativePath("bet")]?.data.bet);
        this.addChild(this.betView);
        this.betController = new BetController(this.betView , this.gameModel);

    }

    private initBettingAreaComponent() {;
        this.bettingAreaView = new BettingAreaView(game.loader.resources[Assets.getInstance().getRelativePath("bettingArea")]?.data.bettingArea);
        this.addChild(this.bettingAreaView);
        this.bettingAreaController = new BettingAreaController(this.bettingAreaView, this.gameModel)
    }

    private initgameMeterComponenets() {
        this.gameMeterView = new GameMetersView(game.loader.resources[Assets.getInstance().getRelativePath("gameMeter")]?.data.gameMeter);
        this.addChild(this.gameMeterView);
        this.gameMeterController = new GameMetersController(this.gameMeterView, this.gameModel);
    }

    private initCardDeckComponents() {
        this.cardDeckView = new CardDeckView(game.loader.resources[Assets.getInstance().getRelativePath("cardDeck")].data.cardDeck)
        this.addChild(this.cardDeckView);
        this.cardDeckController = new CardDeckController(this.cardDeckView, this.gameModel);
    }


    protected resize(_evt?: Event | undefined): void {
        this.position.set(window.innerWidth / 2, window.innerHeight / 2);
        _evt?.preventDefault();
    }


    private betView!: BetView;
    private betController!: BetController;
    private bettingAreaView!: BettingAreaView;
    private bettingAreaController!: BettingAreaController;
    private gameModel: GameModel;

    private gameMeterController: GameMetersController;
    private gameMeterView: GameMetersView;

    private cardDeckController: CardDeckController;
    private cardDeckView: CardDeckView;

}