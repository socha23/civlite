import { PopType } from "./pops"
import { ResourceType } from "./resources"

export interface CostElem {
}

export class Pops implements CostElem {
    type: PopType
    count: number
  
    constructor(type: PopType, count: number) {
      this.type = type
      this.count = count
    }
  }
  
  
  export function pops(type: PopType, count: number) {
    return new Pops(type, count)
  }

  export class Resources implements CostElem {
    type: ResourceType
    count: number

    constructor(type: ResourceType, count: number) {
        this.type = type
        this.count = count
    }
}

export function resources(type: ResourceType, count: number) {
    return new Resources(type, count)
}