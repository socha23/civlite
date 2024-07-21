interface TickListener {
    onTick: (deltaS: number) => void
}

const LISTENERS : TickListener[] = []


export function addTickListener(t: TickListener) {
    LISTENERS.push(t)
}

export function removeTickListener(t: TickListener) {
    if (LISTENERS.indexOf(t) > -1) {
        LISTENERS.splice(LISTENERS.indexOf(t), 1)

    }
}

export function onTick(deltaS: number) {
    LISTENERS.forEach(t => t.onTick(deltaS))
}