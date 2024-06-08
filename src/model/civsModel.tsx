import { Action, action } from "./action"

const DEFAULT_CIV_DEFINITION = {
    population: 20,
    strength: 50,
}

interface CivParams {
    population?: number,
    strength?: number,
    title: string,

}

function civDefinition(params: CivParams) {
    return {...DEFAULT_CIV_DEFINITION, ...params}
}


export class CivModel {
    title: string
    population: number
    strength: number


    constructor(params: CivParams) {
        const def = civDefinition(params)
        this.title = def.title
        this.strength = def.strength
        this.population = def.population
    }
}

function defaultCivs(): CivParams[] {
    return [
        {
            title: "Assholes from the plains",
            population: 15,
            strength: 40,
        },
        {
            title: "Guys from up the river",
            population: 10,
            strength: 30,
        },
        {
            title: "Dickheads from the woods",
            population: 25,
            strength: 60,
        },
        {
            title: "Mountain clans",
            population: 40,
            strength: 120,
        },
    ]
}


export default class CivilizationsModel {
    civs: CivModel[]
    targetActions: Map<CivModel, Action> = new Map()
    targetted?: CivModel

    constructor() {
        this.civs = defaultCivs().map(p => new CivModel(civDefinition(p)))
        this.civs.forEach(c => {
         this.targetActions.set(c, action({
            action: () => {this.targetted = c}
         }))   
        })
    }

    targetAction(c: CivModel): Action {
        return this.targetActions.get(c)!
    }


}