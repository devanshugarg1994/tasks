import { Assets } from "../../Assets";
import { game } from "../../main";
import { ShapeButton } from "../../UiComponent/ShapeButton";
import { Sprite } from "../../UiComponent/Sprite";
import { BetType } from "../constants/BetType";
import { CustomEventConstant, EventConstant } from "../constants/EventConstant";
import { GameModel } from "../GameModel";
import { BettingAreaView } from "./BettingAreaView";

export class BettingAreaController {
    constructor(bettingAreaView: BettingAreaView, gameModel: GameModel) {
        this.bettingAreaView = bettingAreaView;
        this.gameModel = gameModel;

        this.init();
        this.subscribeEvents();
    }

    private init() {
        this.tieBetAreaBtn = this.bettingAreaView.getShapeButtonRefrences("tieBetBtn");
        this.bankerAreaBtn = this.bettingAreaView.getShapeButtonRefrences("bankerBetBtn");
        this.playerAreaBtn = this.bettingAreaView.getShapeButtonRefrences("playerBetBtn");
    }


    private subscribeEvents() {
        this.unSubscribeEvents();
        this.tieBetAreaBtn.registerEvent(EventConstant.POINTER_UP, this.addBetCoinOnTie.bind(this));
        this.bankerAreaBtn.registerEvent(EventConstant.POINTER_UP, this.addBetCoinOnBanker.bind(this));
        this.playerAreaBtn.registerEvent(EventConstant.POINTER_UP, this.addBetCoinOnPlayer.bind(this));
        window.addEventListener(CustomEventConstant.CLEAR_BUTTON_PRESSED, this.onClearBet.bind(this));
        window.addEventListener(CustomEventConstant.RESET_ON_PRESENTATION_COMPLETE, this.onClearBet.bind(this));
        window.addEventListener(CustomEventConstant.ENABLE_DISABLE_BUTTONS, this.buttonsInteractivty.bind(this) as EventListener);
    }


    private unSubscribeEvents() {
        this.tieBetAreaBtn.unRegister(EventConstant.POINTER_UP, this.addBetCoinOnTie.bind(this));
        this.bankerAreaBtn.unRegister(EventConstant.POINTER_UP, this.addBetCoinOnBanker.bind(this));
        this.playerAreaBtn.unRegister(EventConstant.POINTER_UP, this.addBetCoinOnPlayer.bind(this));
        window.removeEventListener(CustomEventConstant.CLEAR_BUTTON_PRESSED, this.onClearBet.bind(this));
        window.addEventListener(CustomEventConstant.RESET_ON_PRESENTATION_COMPLETE, this.onClearBet.bind(this));
        window.removeEventListener(CustomEventConstant.ENABLE_DISABLE_BUTTONS, this.buttonsInteractivty.bind(this) as EventListener);
    }


    private addBetCoinOnTie() {
        if (this.gameModel.getBetAdded() === BetType.NULL || this.gameModel.getBetAdded() === BetType.TIE) {
            this.gameModel.setBetAdded(BetType.TIE);
            this.addBetCoin();
        } 
    } 
    
    private addBetCoinOnBanker() {
        if (this.gameModel.getBetAdded() === BetType.NULL || this.gameModel.getBetAdded() === BetType.BANKER) {
            this.gameModel.setBetAdded(BetType.BANKER);
            this.addBetCoin();
        } 
    }  
    
    private addBetCoinOnPlayer() {
        if (this.gameModel.getBetAdded() === BetType.NULL || this.gameModel.getBetAdded() === BetType.PLAYER) {
            this.gameModel.setBetAdded(BetType.PLAYER);
            this.addBetCoin();
        } 
    }


    private addBetCoin() {
        const betCoinData = game.loader.resources[Assets.getInstance().getRelativePath("betCoinAddedGeneric")]?.data.betCoinAddedGeneric;
        betCoinData.image = this.selectTextutre();
        const betCoin = new Sprite(betCoinData);
        betCoin.scale.set(0.75, 0.75);
        if (this.coinAdded.length) {
            betCoin.x = this.coinAdded[this.coinAdded.length - 1].x + 10;
        }

        betCoin.y = betCoin.y + ((this.gameModel.getBetAdded() - 1) * 70);
        this.coinAdded.push(betCoin);
        this.bettingAreaView.addChild(betCoin);

        this.gameModel.updateTotalBet();
        window.dispatchEvent(new CustomEvent(CustomEventConstant.COIN_ADDED));
        window.dispatchEvent(new CustomEvent(CustomEventConstant.DEAL_BUTTON_ENABLE_DISABLE, {
            detail : {
                value: true
            }
        }));

    }

    private selectTextutre(): string {
        const betIndex = this.gameModel.getbetCoinIndex();
        switch (betIndex) {
            case 0:
                return "oneBet";
            case 1:
                return "tenBet";
            case 2:
                return "hundredBet";
            case 3:
                return "fiveHundredBet";
            case 4:
                return "thousandBet";

            default:
                throw new Error("Texture not found");

        }

    }

    private buttonsInteractivty(event: CustomEvent) {
        const value = event.detail.value;
        this.tieBetAreaBtn.buttonMode = value;
        this.bankerAreaBtn.buttonMode = value;
        this.playerAreaBtn.buttonMode = value;  
        
        this.tieBetAreaBtn.interactive = value;
        this.bankerAreaBtn.interactive = value;
        this.playerAreaBtn.interactive = value;
    }

    private onClearBet() {
        this.coinAdded.forEach((element: Sprite) => {
            element.destroy();
        });
        this.coinAdded.length = 0;
        this.gameModel.resetTotalBet();
    }




    private bettingAreaView: BettingAreaView;
    private tieBetAreaBtn: ShapeButton;
    private bankerAreaBtn: ShapeButton;
    private playerAreaBtn: ShapeButton;
    private gameModel: GameModel;

    private coinAdded: Sprite[] = [];
}