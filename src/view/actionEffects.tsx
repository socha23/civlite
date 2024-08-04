import { addTickListener } from "../model/timer"
import { Animation, AnimationFrame } from "./animations"
import { coordsIdActionWrapper, getCoords } from "./coordsCatcher"

export class ActionEffect {
    id: string
    duration: number
    lifetime: number = 0

    constructor(id: string, duration: number) {
        this.id = id
        this.duration = duration
        this.lifetime = this.lifetime
    }

    onTick(deltaS: number) {
        this.lifetime += deltaS
    }

    get complete() {
        return this.lifetime > this.duration
    }
}

export class AnimatedActionEffect<T> extends ActionEffect {
    animation: Animation<T>

    constructor(id: string, animation: Animation<T>) {
        super(id, animation.duration)
        this.animation = animation
    }

    onTick(deltaS: number) {
        super.onTick(deltaS)
        this.animation.onTick(deltaS)
    }
}


let effects = new Map<string, ActionEffect[]>()

export function getEffects(id: string): ActionEffect[] {
    return effects.get(id) || []
}

export function registerEffect(a: ActionEffect) {
    if (!effects.has(a.id)) {
        effects.set(a.id, [])
    }
    effects.get(a.id)?.push(a)
}

addTickListener({
    onTick(deltaS: number) {
        const newM = new Map<string, ActionEffect[]>()
        Array.from(effects.keys()).forEach(k => {
            const newA: ActionEffect[] = []
            effects.get(k)!!.forEach(e => {
                e.onTick(deltaS)
                if (!e.complete) {
                    newA.push(e)
                }
            })
            if (newA) {
                newM.set(k, newA)
            }
        })
        effects = newM
    }
})

type FlashingBorderA = {
    flashRadius: number 
}

function flashRadiusAnimation(id: string, duration: number, flashDuration: number, flashRadius: number): Animation<FlashingBorderA> {
    const frames = [] as AnimationFrame<FlashingBorderA>[]
    frames.push({
        time: 0,
        flashRadius: 0
    })
    let passed = 0
    while (passed <= duration) {
        frames.push({
            time: passed + flashDuration / 2,
            flashRadius: flashRadius
        })
        frames.push({
            time: passed + flashDuration,
            flashRadius: 0
        })
        passed += flashDuration
    }
    return new Animation(id, frames)
}

type FlashingBorderParams = {
    id: string,
    duration: number, 
    flashDuration: number,
    flashRadius: number, 
}

export class FlashingBorderEffect extends AnimatedActionEffect<FlashingBorderA> {
    constructor(p: FlashingBorderParams) {
        super(p.id, flashRadiusAnimation(p.id, p.duration, p.flashDuration, p.flashRadius))
    }
}

export function spawnActionCompleted(actionId: string, duration: number = 2, numFlashes = 5) {
    registerEffect(new FlashingBorderEffect({
        id: actionId,
        duration: duration,
        flashDuration: duration / numFlashes,
        flashRadius: 20,
    }))
}

export class RollupEffect extends AnimatedActionEffect<{height: number}> {
    constructor(id: string, duration: number, delay: number) {
        const startHeight = (getCoords(coordsIdActionWrapper(id)) || {height: 100}).height
        const animation = new Animation<{height: number}>(id, [
                {
                    time: 0,
                    height: startHeight
                },
                {
                    time: delay,
                    height: startHeight
                },
                {
                    time: duration + delay,
                    height: 0
                },
            ])
        super(id, animation)
    }
}

export function spawnRollUp(id: string, duration: number = 1, delay: number = 0) {
    registerEffect(new RollupEffect(id, duration, delay))
}