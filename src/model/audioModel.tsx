import { playSound, SoundType } from "../view/sounds";
import { Action } from "./action";
import { Amount } from "./amount";
import { GameModel } from "./gameModel";
import { UpgradeNode } from "./upgradeModel";

export class AudioModel {
    model: GameModel

    actionSound?: SoundType

    constructor(model: GameModel) {
        this.model = model
    }

    onEndOfTurn() {
    }
        
    onFeed() {
        playSound(SoundType.FeedPops)
    }

    onEndOfSeason() {

    }

    onTick(deltaS: number) {
        if (this.actionSound) {
            playSound(this.actionSound)
        }
        this.actionSound = undefined
    }

    onActionComplete(a: Action) {
        if (a.soundOnComplete) {
            this.actionSound = a.soundOnComplete
        }
    }
}

