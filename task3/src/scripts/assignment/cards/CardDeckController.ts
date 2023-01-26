import { shuffleArray } from "../../ArrayUtlis";
import { Assets } from "../../Assets";
import { game } from "../../main";
import GSAP from "gsap";
import { Sprite } from "../../UiComponent/Sprite";
import { GameModel } from "../GameModel";
import { CardDeckView } from "./CardDeckView";
import { WinnerType } from "../constants/WinnerType";
import { CustomEventConstant } from "../constants/EventConstant";

export class CardDeckController {

    constructor(cardView: CardDeckView, gameModel: GameModel) {
        this.cardView = cardView;
        this.gameModel = gameModel;
        this.subscribeEvents();
    }


    private subscribeEvents() {
        this.unSubscribeEvents();
        window.addEventListener(CustomEventConstant.SHOW_CARDS, this.showCard.bind(this));
        window.addEventListener(CustomEventConstant.RESET_ON_PRESENTATION_COMPLETE, this.destroyAllCards.bind(this));

    }

    private unSubscribeEvents() {
        window.removeEventListener(CustomEventConstant.SHOW_CARDS, this.showCard.bind(this));
        window.removeEventListener(CustomEventConstant.RESET_ON_PRESENTATION_COMPLETE, this.destroyAllCards.bind(this));

    }


    private showCard() {
        const cardId: number[] = this.findfourRandomCard();
        this.calculateHandValue(cardId);
        this.checkforWin();
        const cardData = game.loader.resources[Assets.getInstance().getRelativePath("cardshow")]?.data.cardshow;
        cardId.forEach((value: number) => {
            cardData.id = cardData.id + value;
            cardData.image = "card" + value;
            const card = new Sprite(cardData);
            card.visible = false;
            card.position.set(270, -260);
            this.cards.push(card);
            this.cardView.addChild(card);
        }, this);
        this.moveCards();
    }


    private moveCards(index: number = 0) {
        if (index >= this.cards.length) {
            this.onAnimationComplete();
            return;
        }
        const processingCard = this.cards[index];
        processingCard.visible = true;
        let posX = (-350 + (index * 100));
        if (index > 1) {
            posX += 200;
        }
        index++;
        GSAP.to(processingCard, { duration: 3, x: posX, yoyo: false, repeat: 0 })
            .eventCallback("onComplete", this.moveCards.bind(this), [index]);
    }

    private onAnimationComplete() {
        GSAP.delayedCall(3, () => {
            window.dispatchEvent(new CustomEvent(CustomEventConstant.UPDATE_METERS_ON_CARD_SHOWN));
            this.destroyAllCards();
        });
    }


    private findfourRandomCard(): number[] {
        const cardId: number[] = [];
        for (let i: number = 0; i < 52; i++) {
            cardId.push(i + 1);
        }
        shuffleArray(cardId);
        return [cardId[0], cardId[1], cardId[2], cardId[3]];
    }

    private calculateHandValue(cardIds: number[]) {
        this.playerHand = (this.calaculateCardValue(cardIds[0]) + this.calaculateCardValue(cardIds[1])) % 10;
        this.bankerHand = (this.calaculateCardValue(cardIds[2]) + this.calaculateCardValue(cardIds[3])) % 10;
        console.log("Player Hand: " + this.playerHand);
        console.log("Banker Hand : " + this.bankerHand);
    }


    private calaculateCardValue(id: number) {
        if ((id % 13) > 9 ) {
            return 0;
        }
        return id % 13;
    }


    private checkforWin()  {
        if (this.playerHand > this.bankerHand) {
            this.gameModel.setWinnerType(WinnerType.PLAYER)
        } else if (this.playerHand < this.bankerHand) {
            this.gameModel.setWinnerType(WinnerType.BANKER)
        } else if (this.playerHand === this.bankerHand) {
            this.gameModel.setWinnerType(WinnerType.TIE)
        }
    }

    private destroyAllCards() {
        this.cards.forEach((element: Sprite) => {
            element.destroy();
        }, this);
        this.cards.length = 0;

    }

    private cardView: CardDeckView;
    private gameModel: GameModel;

    private cards: Sprite[] = [];

    private playerHand: number;
    private bankerHand: number;
}