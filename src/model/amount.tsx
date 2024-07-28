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

interface Countable {
  count: number
}

interface _Amount<Type extends ItemType> extends Countable {
  type: Type
  assignment: boolean
}

export type Amount = _Amount<ItemType>

export function isAmount(a: any): a is Amount {
  return "type" in a && "count" in a
}

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

  constructor(amountsOrTypes: (Amount | ItemType)[]) {
    amountsOrTypes.forEach(a => {
      if (typeof a === "object") {
        this.accs.set(a.type, new SingleAmountAccumulator(a.count))
      } else {
        this.accs.set(a, new SingleAmountAccumulator(0))
      }
    })
  }

  contains(type: ItemType) {
    return this.accs.has(type)
  }

  collected(type: ItemType): number {
    if (!this.accs.has(type)) {
      throw new Error(`This accumulator doesnt collect ${type}`)
    } else {
      return this.accs.get(type)!.collected
    }
  }

  add(type: ItemType, amount: number) {
    if (this.accs.has(type)) {
      this.accs.get(type)!!.add(amount)
    } else {
      throw new Error(`This accumulator doesnt collect ${type}`)
    }
  }

  get completed() {
    const incomplete = Array.from(this.accs.values()).filter(a => !a.completed)
    return incomplete.length === 0
  }

  reset() {
    Array.from(this.accs.values()).forEach(t => t.reset())
  }

  completionRatio(types: ItemType[]) {
    let collected = 0
    let required = 0
    types.forEach(t => {
      required += this.accs.get(t)!.required
      collected += this.accs.get(t)!.collected
    })
    if (required === 0) {
      return 1
    } else {
      return collected / required
    }
  }

  missingOfType(type: ItemType) : number {
     return this.accs.get(type)?.missing || 0
  }


  get missing() {
    return Array.from(this.accs.keys()).map(t => ({type: t, count: this.accs.get(t)!!.missing}))
  }

  get required() {
    return Array.from(this.accs.keys()).map(t => ({type: t, count: this.accs.get(t)!!.required}))
  }
}

export class SingleAmountAccumulator {
  required: number
  collected: number

  constructor(required: number, collected: number = 0) {
    this.required = required
    this.collected = collected
  }

  add(amount: number) {
    this.collected += amount
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
      return Math.min(this.collected, this.required) / this.required
    }
  }

  get missing() {
    return Math.max(0, this.required - this.collected)
  }
}

interface Countable {
  count: number
}

export function multiply<T extends Countable | Countable[]>(amount: T, mulBy: number): T {
  if (Array.isArray(amount)) {
    return amount.map(a => ({...a, count: a.count * mulBy})) as T
  } else {
    return {...amount, count: amount.count * mulBy}
  }
}

export function negative<T extends Countable>(amount: T[]): T[] {
  return amount.map((a: T) => ({...a, count: -a.count}))
}

