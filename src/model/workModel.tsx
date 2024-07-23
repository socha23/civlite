import { listInProgressActions } from "./actionsModel"
import { Amount, isWorkType } from "./amount"
import { GameModel } from "./gameModel"
import { WorkType } from "./work"


class WorkTypeModel {
    type: WorkType
    model: GameModel

    constructor(type: WorkType, model: GameModel) {
        this.type = type
        this.model = model
    }

    add(count: number) {
        const needy = listInProgressActions()
            .filter(a => a.needsWorkOfType(this.type))
        needy.forEach(a => a.onWork(this.type, count / needy.length, this.model))
    }
}


export class WorkModel {

    workModels: WorkTypeModel[]

    constructor(model: GameModel) {
        this.workModels = Object.values(WorkType).map(type => new WorkTypeModel(type, model))
    }


    work(type: WorkType): WorkTypeModel {
        return this.workModels.find(m => m.type === type)!
    }

    add(values: Amount[]) {
        values.forEach(c => {
            if (isWorkType(c.type)) {
                this.work(c.type).add(c.count)
            }
        })
    }
}
