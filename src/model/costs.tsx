import { PopType } from "./pops"
import { ResourceType } from "./resources"

export interface Amount {
  popType?: PopType 
  resourceType?: ResourceType
  assignment: boolean
  count: number
}

export function amountValueType(a: {popType?: PopType, resourceType?: ResourceType}) : PopType | ResourceType {
  if (a.popType) {
    return a.popType
  } else if (a.resourceType) {
    return a.resourceType
  } else {
    console.log(a)
    throw `Illegal amount type ${a}`
  }
}


export class Pops implements Amount {
  popType: PopType
  count: number
  assignment = false

  constructor(type: PopType, count: number) {
    this.popType = type
    this.count = count
  } 
}


export function pops(type: PopType, count: number) {
  return new Pops(type, count)
}

export class Resources implements Amount {
  resourceType: ResourceType
  count: number
  assignment: boolean

  constructor(type: ResourceType, count: number, assignment: boolean) {
      this.resourceType = type
      this.count = count
      this.assignment = assignment
  }
}

export function resources(type: ResourceType, count: number) {
    return new Resources(type, count, false)
}

export function assignResources(type: ResourceType, count: number) {
  return new Resources(type, count, true)
}