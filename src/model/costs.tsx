import { PopType } from "./pops"
import { ResourceType } from "./resources"

export type ItemType = PopType | ResourceType

export function isPopType(p: ItemType): p is PopType {
  return Object.keys(PopType).includes(p)
}

export function isResourceType(p: ItemType): p is ResourceType {
  return Object.keys(ResourceType).includes(p)
}

export interface Amount {
  type: ItemType 
  assignment: boolean
  count: number
}

/////////////////

export interface PopAmount extends Amount {
  type: PopType 
}

export function isPopAmount(a: {type: ItemType}): a is PopAmount {
  return isPopType(a.type)
}

export function pops(type: PopType, count: number): PopAmount {
  return {
    type: type,
    count: count,
    assignment: false
  }
}

export interface ResourceAmount extends Amount {
  type: ResourceType 
}

export function isResourceAmount(a: {type: ItemType}): a is ResourceAmount {
  return isResourceType(a.type)
}


export function resources(type: ResourceType, count: number): ResourceAmount {
  return {
    type: type,
    count: count,
    assignment: false
  }
}

export function assignResources(type: ResourceType, count: number) {
  return {
    type: type,
    count: count,
    assignment: true
  }
}