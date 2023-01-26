import { Button } from "../../UiComponent/Button";
import { Sprite } from "../../UiComponent/Sprite";
import { BetType } from "../constants/BetType";
import { CustomEventConstant, EventConstant } from "../constants/EventConstant";
import { GameModel } from "../GameModel";
import { BetView } from "./BetView";

export class BetController {
    constructor(betView: BetView, gameModel: GameModel) {
        this.gameModel = gameModel;
        this._betView = betView;
        this.init();
        this.subscribeEvents();

        this.dealBtn.buttonMode = false;
        this.dealBtn.interactive = false;

    }

    private subscribeEvents() {
        this.unSubscribeEvents();
        this.lastBetCoinBtn.on(EventConstant.POINTER_UP, this.lastBetCoin.bind(this));
        this.nextBetCoinBtn.on(EventConstant.POINTER_UP, this.nextBetCoin.bind(this));
        this.clearBetBtn.on(EventConstant.POINTER_UP, this.clearBet.bind(this));
        this.dealBtn.on(EventConstant.POINTER_UP, this.onDealBtntPressed.bind(this));

        window.addEventListener(CustomEventConstant.ENABLE_DISABLE_BUTTONS, this.buttonsInteractivty.bind(this) as EventListener);
        window.addEventListener(CustomEventConstant.RESET_ON_PRESENTATION_COMPLETE, this.reset.bind(this));
        window.addEventListener(CustomEventConstant.DEAL_BUTTON_ENABLE_DISABLE, this.dealBtnDisableEnable.bind(this) as EventListener);
    }


    private unSubscribeEvents() {
        this.lastBetCoinBtn.off(EventConstant.POINTER_UP, this.lastBetCoin.bind(this));
        this.nextBetCoinBtn.off(EventConstant.POINTER_UP, this.nextBetCoin.bind(this));
        this.clearBetBtn.off(EventConstant.POINTER_UP, this.clearBet.bind(this));
        this.dealBtn.off(EventConstant.POINTER_UP, this.onDealBtntPressed.bind(this));
        window.removeEventListener(CustomEventConstant.RESET_ON_PRESENTATION_COMPLETE, this.reset.bind(this));
        window.removeEventListener(CustomEventConstant.ENABLE_DISABLE_BUTTONS, this.buttonsInteractivty.bind(this) as EventListener);
        window.removeEventListener(CustomEventConstant.DEAL_BUTTON_ENABLE_DISABLE, this.dealBtnDisableEnable.bind(this) as EventListener);

    }


    private init() {
        for (let i: number = 1; i <= 5; i++) {
            const betCoin: Sprite = this._betView.getSpriteRefrences("betCoin" + i);
            betCoin.visible = false;
            this.possibleBets.push(betCoin);
            (i === 1) && (this.possibleBets[0].visible = true);
        }
        this.currentCoinIndex = 0;
        this.nextBetCoinBtn = this._betView.getButtonRefrences("nextBetCoin");
        this.lastBetCoinBtn = this._betView.getButtonRefrences("lastBetCoin");
        this.clearBetBtn = this._betView.getButtonRefrences("clearBet");
        this.dealBtn = this._betView.getButtonRefrences("dealBtn");

    }


    private nextBetCoin() {
        if (this.currentCoinIndex + 1 < this.possibleBets.length) {
            this.possibleBets[this.currentCoinIndex].visible = false;
            this.possibleBets[this.currentCoinIndex + 1].visible = true;
            this.currentCoinIndex++;
            this.gameModel.setBetCoinIndex(this.currentCoinIndex);
        }
    }

    private lastBetCoin() {
        if (this.currentCoinIndex - 1 >= 0) {
            this.possibleBets[this.currentCoinIndex].visible = false;
            this.possibleBets[this.currentCoinIndex - 1].visible = true;
            this.currentCoinIndex--;
            this.gameModel.setBetCoinIndex(this.currentCoinIndex);
        }
    }


    private clearBet() {
        window.dispatchEvent(new CustomEvent(CustomEventConstant.CLEAR_BUTTON_PRESSED));
        this.gameModel.setBetAdded(BetType.NULL);
    }

    private reset() {
        this.gameModel.setBetAdded(BetType.NULL);
    }

    private onDealBtntPressed() {
        window.dispatchEvent(new CustomEvent(CustomEventConstant.ENABLE_DISABLE_BUTTONS, {
            detail: {
                value: false
            }
        }));

        window.dispatchEvent(new CustomEvent(CustomEventConstant.DEAL_BUTTON_ENABLE_DISABLE, {
            detail : {
                vlaue: false
            }
        }));
        window.dispatchEvent(new CustomEvent(CustomEventConstant.SHOW_CARDS));
    }

    private buttonsInteractivty(event: CustomEvent) {
        const value = event.detail.value;
        this.nextBetCoinBtn.buttonMode = value;
        this.nextBetCoinBtn.interactive = value;

        this.lastBetCoinBtn.buttonMode = value;
        this.lastBetCoinBtn.interactive = value;

        this.clearBetBtn.buttonMode = value;
        this.clearBetBtn.interactive = value;
    }

    private dealBtnDisableEnable(event: CustomEvent) {
        const value = event.detail.value;
        this.dealBtn.buttonMode = value;
        this.dealBtn.interactive = value;
    }


    private _betView: BetView;
    private possibleBets: Sprite[] = [];
    private currentCoinIndex: number = 0;
    private clearBetBtn: Button;
    private dealBtn: Button;

    private nextBetCoinBtn!: Button;
    private lastBetCoinBtn!: Button;
    private gameModel: GameModel;
}