import { Action, action } from "./action"
import { ResourceType, resourceDefinition } from "./resources"
import { Amount, ResourceAmount, isResourceAmount, isResourceType, resources } from "./amount"




interface ResearchNode {
    prerequisites: ResearchNode[]
    cost: Amount[]
    duration: number

}
