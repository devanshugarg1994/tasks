import { BetType } from "./constants/BetType";
import { WinnerType } from "./constants/WinnerType";

export class GameModel {
    constructor() {
        this.setBetCoinIndex(0);
        this.setBetAdded(BetType.NULL);
        this.setCreditAmt(1000000);
    }


    getbetCoinIndex(): number {
        return this.betCoinIndex;
    }

    setBetCoinIndex(index: number) {
        this.betCoinIndex = index;
    }

    setBetAdded(value: BetType) {
        this.betAddingAt = value;
    }

    getBetAdded(): BetType {
        return this.betAddingAt;
    }

    getWinAmt(): number {
        console.log("betAddingAt :" + this.betAddingAt);
        if (this.betAddingAt === BetType.BANKER) {
            if (this.winner === WinnerType.BANKER) {
              return  this.totalBetAmt * 2;
            }

        } else if (this.betAddingAt === BetType.PLAYER) {
            if (this.winner === WinnerType.PLAYER) {
               return this.totalBetAmt * 2;

            }

        } else if (this.betAddingAt === BetType.TIE) {
            if (this.winner === WinnerType.TIE) {
             return 0;

            }
        }
        return -1;
    }

    setWinnerType(winner: WinnerType) {
        console.log("winner: " +  winner)
        this.winner = winner;
    }

    getWinnerType(): WinnerType {
        return this.winner;
    }

    updateTotalBet() {
        this.totalBetAmt += this.betCoinsValue[ this.betCoinIndex];
        this.updateCredit(-this.betCoinsValue[ this.betCoinIndex])
        console.log(this.totalBetAmt);
    }

    resetTotalBet() {

        this.creditAmt += this.totalBetAmt;
        this.totalBetAmt = 0;
    }

    getTotalBet(): number {
        return this.totalBetAmt
    }

    updateCredit(value: number) {
        this.creditAmt += value;
    }

    getCreditAmt(): number {
        return this.creditAmt;
    }

    setCreditAmt(value: number) {
        this.creditAmt = value;
    }


    private betCoinIndex!: number;
    private betAddingAt: BetType;
    private totalBetAmt: number = 0;
    private winner: WinnerType;
    private creditAmt: number;
    private betCoinsValue: number []= [1, 10, 100, 500, 1000];

}