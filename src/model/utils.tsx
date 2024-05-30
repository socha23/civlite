export function sum<T>(items: T[], op: (arg: T) => number) {
    let total = 0
    items.forEach(i => {
      total += op(i)
    })
    return total
  }