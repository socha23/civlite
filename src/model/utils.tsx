export function sum<T>(items: T[], op: (arg: T) => number) {
    let total = 0
    items.forEach(i => {
      total += op(i)
    })
    return total
  }

export function formatNumber(n: number) {
  const val = n
  let fixed = 0
  n = Math.abs(n)
  while(n < 1) {
    fixed++
    n *= 10
  }
  return val.toFixed(fixed)
}