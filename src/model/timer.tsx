interface TickListener {
    onTick: (deltaS: number) => void
}

const LISTENERS : TickListener[] = []


export function addTickListener(t: TickListener) {
    LISTENERS.push(t)
}

export function onTick(deltaS: number) {
    LISTENERS.forEach(t => t.onTick(deltaS))
}