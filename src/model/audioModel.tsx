import { playSound, SoundType } from "../view/sounds";
import { GameModel } from "./gameModel";
import { UpgradeNode } from "./upgradeModel";

export class AudioModel {
    model: GameModel

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

    onUpgradeComplete(u: UpgradeNode) {
        let soundType = SoundType.ResearchComplete
        playSound(soundType)
    }
}

