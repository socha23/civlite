import { Action, action } from "./action"
import { listInProgressActions } from "./actionsModel"
import { Amount, isWorkType, work, } from "./amount"
import { WorkDefinitions, WorkType } from "./work"


class WorkTypeModel {
    type: WorkType
    gatherAction: Action

    constructor(type: WorkType) {
        this.type = type
        this.gatherAction = action({
            rewards: [work(type, 1)],
            timeCost: WorkDefinitions[type].gatherTimeout,
            exclusivityGroup: "gathering"
        })
    }

    add(count: number) {
        const needy = listInProgressActions()
            .filter(a => a.needsWorkOfType(this.type))
        needy.forEach(a => a.onWork(this.type, count / needy.length))
    }
}


export class WorkModel {
    workModels = Object.values(WorkType).map(type => new WorkTypeModel(type))

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
