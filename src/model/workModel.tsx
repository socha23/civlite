import { Action, action } from "./action"
import { Amount, isWorkType, work, } from "./amount"
import { WorkDefinitions, WorkType } from "./work"


class WorkTypeModel {
    type: WorkType
    gatherAction: Action

    constructor(type: WorkType) {
        this.type = type
        this.gatherAction = action({
            rewards: [work(type, 1)],
            timeCost: WorkDefinitions[type].gatherTimeout
        })
    }
}


export class WorkModel {
    workModels = Object.values(WorkType).map(type => new WorkTypeModel(type))

    work(type: WorkType): WorkTypeModel {
        return this.workModels.find(m => m.type === type)!
    }

    gain(values: Amount[]) {
        values.forEach(c => {
            if (isWorkType(c.type)) {
                /// TODO
            }
        })
    }
}
