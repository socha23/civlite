export function sum<T>(items: T[], op: (arg: T) => number) {
    let total = 0
    items.forEach(i => {
      total += op(i)
    })
    return total
  }

export function formatNumber(n: number) {
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
  return val.toFixed(fixed)
}

export function gaussRandom(from: number, to: number) {
  return from +
   (to - from) * (Math.random() + Math.random()) / 2 
}