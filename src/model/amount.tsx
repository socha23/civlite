import { PopType } from "./pops"
import { ResourceType } from "./resources"

export type ItemType = PopType | ResourceType

export function isPopType(p: ItemType): p is PopType {
  return Object.keys(PopType).includes(p)
}

export function isResourceType(p: ItemType): p is ResourceType {
  return Object.keys(ResourceType).includes(p)
}

///////////////////////////////////////////

type _Amount<Type extends ItemType> = {
  type: Type
  assignment: boolean
  count: number
}

export type Amount = _Amount<ItemType>

///////////////////////////////////////////

export type PopAmount = _Amount<PopType>

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

export type ResourceAmount = _Amount<ResourceType>

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

///////////////////////////////////////////

type _ExpectedAmount<Type extends ItemType> = {
  type: Type 
  from: number
  to: number
}

export type ExpectedAmount = _ExpectedAmount<ItemType>
export type ExpectedPopAmount = _ExpectedAmount<PopType>
export type ExpectedResourceAmount = _ExpectedAmount<ResourceType>


export function rollActualAmount<T extends ItemType>(a: _ExpectedAmount<T>): _Amount<T> {
  const v = Math.floor(a.from + (Math.random() * (a.to - a.from + 1)))
  return {
    type: a.type,
    count: v,
    assignment: false
  }
}
