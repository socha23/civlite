export function sum<T>(items: T[], op: (arg: T) => number) {
    let total = 0
    items.forEach(i => {
      total += op(i)
    })
    return total
  }

export function formatNumber(n: number, maxDigits = 1) {
  if (Math.abs(n) < 0.001) {
    return 0
  }
  const val = n
  let fixed = 0
  n = Math.abs(n)
  while(n < 1) {
    fixed++
    n *= 10
  }
  return val.toFixed(Math.min(fixed, maxDigits))
}

export function gaussRandom(from: number, to: number) {
  return from +
   (to - from) * (Math.random() + Math.random()) / 2 
}

export class InclusiveIntRange {
  from: number
  to: number

  constructor(from: number, to: number) {
    this.from = Math.floor(from)
    this.to = Math.ceil(to)
  }

  randomValue() {
    return Math.floor(this.from + (this.to + 1 - this.from) * Math.random())
  }
}