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
  accs: Map<ItemType, SingleAmountAccumulator> = new Map()

  constructor(amounts: Amount[]) {
    amounts.forEach(a => {
      this.accs.set(a.type, new SingleAmountAccumulator(a.count))
    })
  }

  add(type: ItemType, amount: number) {
    if (this.accs.has(type)) {
      this.accs.get(type)!!.add(amount)
    }
  }

  get completed() {
    const incomplete = Array.from(this.accs.values()).filter(a => !a.completed)
    return incomplete.length === 0
  }

  reset() {
    Array.from(this.accs.values()).forEach(t => t.reset())
  }

  get completionRatio() {
    let collected = 0
    let required = 0
    Array.from(this.accs.values()).forEach(t => {
      required += t.required
      collected += t.collected
    })
    if (required === 0) {
      return 1
    } else {
      return collected / required
    }
  }

  get missing() {
    return Array.from(this.accs.keys()).map(t => ({type: t, count: this.accs.get(t)!!.missing}))
  }
}

export class SingleAmountAccumulator {
  required: number
  collected: number

  constructor(required: number) {
    this.required = required
    this.collected = 0
  }

  add(amount: number) {
    this.collected = Math.min(this.required, this.collected + amount)
  }

  get completed() {
    return this.collected >= this.required
  }

  reset() {
    this.collected = 0
  }

  get completionRatio() {
    if (this.required === 0) {
      return 1
    } else {
      return this.collected / this.required
    }
  }

  get missing() {
    return this.required - this.collected
  }
}