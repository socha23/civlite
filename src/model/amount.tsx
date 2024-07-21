import { PopType } from "./pops"
import { ResourceType } from "./resources"
import { WorkType } from "./work"

export type ItemType = PopType | ResourceType | WorkType

export function isPopType(p: ItemType): p is PopType {
  return Object.keys(PopType).includes(p)
}

export function isResourceType(p: ItemType): p is ResourceType {
  return Object.keys(ResourceType).includes(p)
}

export function isWorkType(p: ItemType): p is WorkType {
  return Object.keys(WorkType).includes(p)
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

export type WorkAmount = _Amount<WorkType>

export function isWorkAmount(a: {type: ItemType}): a is WorkAmount {
  return isWorkType(a.type)
}

export function work(type: WorkType, count: number): WorkAmount {
  return {
    type: type,
    count: count,
    assignment: false
  }
}

export function time(count: number) {
  return work(WorkType.Time, count)
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


export class AmountsAccumulator {
  required: Map<ItemType, number> = new Map()
  collected: Map<ItemType, number> = new Map()

  constructor(amounts: Amount[]) {
    amounts.forEach(a => {
      this.required.set(a.type, a.count)
      this.collected.set(a.type, 0)
    })
  }

  add(type: ItemType, amount: number) {
    if (this.required.has(type)) {
      const requiredA = this.required.get(type)!!
      const collectedA = this.collected.get(type)!!
      this.collected.set(type, Math.min(requiredA, collectedA + amount))
    }
  }

  get completed() {
    return !(Array.from(this.required.keys()).find(r => this.collected.get(r)!! < this.required.get(r)!!))
  }

  reset() {
    Array.from(this.required.keys()).forEach(t => this.collected.set(t, 0))
  }

  get completionRatio() {
    let collected = 0
    let required = 0
    Array.from(this.required.keys()).forEach(t => {
      required += this.required.get(t)!!
      collected += this.collected.get(t)!!
    })
    if (required === 0) {
      return 1
    } else {
      return collected / required
    }
  }
}