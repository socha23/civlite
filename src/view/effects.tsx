import React, { ReactNode } from "react"
import { Amount } from "../model/amount"
import { addTickListener } from "../model/timer"
import { gaussRandom } from "../model/utils"
import { Colors, FontSizes } from "./icons"
import { getCoords } from "./coordsCatcher"
import { Amounts, AmountWithColorProps } from "./amount"
import { SoundDing } from "./sounds"

type EffectValue = AmountWithColorProps[] | string | ReactNode

let autoinc = 0

type FrameParams = {
    x?: number
    y?: number
    opacity?: number
    fontSize?: number
}

type AnimationFrame = {
    time: number
    params: FrameParams
}

class Animation {
    duration: number
    lifetime: number = 0

    frames: AnimationFrame[]

    constructor(p: {
        from: FrameParams,
        to: FrameParams, 
        duration?: number,
        additionalFrames?: AnimationFrame[]
        }) {
        this.frames = [
            {
                time: 0,
                params: p.from,
            },
            ...(p.additionalFrames || []),
            {
                time: 1,
                params: p.to,
            }
        ]        
        this.duration = p.duration || 3
    }

    onTick(deltaS: number) {
        this.lifetime += deltaS
    }

    get complete() {
        return this.lifetime > this.duration
    }

    value(id: keyof (FrameParams)): number {
        const completion = Math.min(1, this.lifetime / this.duration)
        let lastValue = 0
        let lastTime = 0
        for (let i = 0; i < this.frames.length; i++) {
            const f = this.frames[i]
            if (f.params[id] !== undefined) {
                if (f.time < completion) {
                    lastTime = f.time
                    lastValue = f.params[id]!!
                } else {
                    const timeSinceLast = completion - lastTime
                    const totalTimePerChange = f.time - lastTime
                    const currentValue = f.params[id]!!
                    return lastValue + (currentValue - lastValue) * (timeSinceLast / totalTimePerChange)
                }
            }
        }
        return lastValue
    }

    get x() {
        return this.value("x")
    }

    get y() {
        return this.value("y")
    }

    get opacity() {
        return this.value("opacity")
    }

    get fontSize() {
        return this.value("fontSize")
    }
}


class AnimatedEffect {
    id: string
    coordsId: string
    animation: Animation
    value: EffectValue

    constructor(p: {
        id: string, 
        coordsId: string,
        value: EffectValue, 
        animation: Animation,
    }) {
        this.id = p.id
        this.coordsId = p.coordsId
        this.animation = p.animation
        this.value = p.value
    }

    props(): EffectElemProps {
        return {
            id: this.id,
            coordsId: this.coordsId,
            value: this.value,
            x: this.animation.x,
            y: this.animation.y,
            opacity: this.animation.opacity,
            fontSize: this.animation.fontSize,
        }
    }

    shouldBeDespawned() {
        return this.animation.complete
    }

    onTick(deltaS: number) {
        this.animation.onTick(deltaS)
    }
}

let effects: AnimatedEffect[] = []

function registerEffect(e: AnimatedEffect) {
    effects.push(e)
}

export function currentEffects(): AnimatedEffect[] {
    return effects
}

addTickListener({
    onTick(deltaS: number) {
        const newEffects: AnimatedEffect[] = []
        effects.forEach(e => {
            e.onTick(deltaS)
            if (!e.shouldBeDespawned()) {
                newEffects.push(e)
            }
        })
        effects = newEffects
    }
})



type EffectElemProps = {
    id: string
    coordsId: string
    value: EffectValue
    x: number
    y: number
    opacity: number
    fontSize: number
}

const EffectElem = (e: EffectElemProps) => {
    const coords = getCoords(e.coordsId)

    if (!coords || e.x === undefined || e.y === undefined) {
        return <div/>
    }

    const left = coords.left - 15 + coords.width + e.x
    const top = coords.top + e.y

    if (!left || !top) {
        return <div/>
    }

    return <div style={{
        fontSize: e.fontSize,
        fontWeight: "bold",
        position: "absolute",
        top: top,
        left: left,
        opacity: e.opacity,
        WebkitTextStroke: "1px black",
        textShadow: "0px 0px 4px #444"
    }}>
        {
            (Array.isArray(e.value)) ? <Amounts items={e.value} /> : e.value
        }
    </div>
}

export const Effects = () => {
    return <div style={{
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 10,
    }}>
        {
            effects.map(e => <EffectElem key={e.id} {...e.props()} />)
        }
    </div>
}



export function spawnEffectNumberIncrease(id: string, value: number, size: number = FontSizes.normal) {
    return spawnEffect(id, 
        <span style={{ fontSize: size, color: Colors.award }}>+{value}</span>,
        {
        }
    )
}

export function spawnEffectCost(id: string, value: Amount[]) {
    return spawnEffect(id, 
        value.map(v => ({ color: Colors.cost, ...v })),
        {
            dirFrom: 0,
            dirTo: Math.PI / 2,

        }
        
    )
}

export function spawnEffectAwards(id: string, value: Amount[]) {
    return spawnEffect(id, 
        value.map(v => ({ color: Colors.award, ...v })),
        {
            dirFrom: Math.PI * 1.62,
            dirTo: Math.PI * 1.80,
        }
    )
}

export function spawnEffect(id: string, value: EffectValue, p: {
    dirFrom?: number,
    dirTo?: number,
}) {
    const dirFromS = p.dirFrom || 0
    const dirToS = p.dirTo || 2 * Math.PI
    const dir = dirFromS + Math.random() * (dirToS - dirFromS)


    const distanceFrom = 0
    const distance = 40
    const duration = 2
    
    const from = {
        x: Math.cos(dir) * distanceFrom,
        y: Math.sin(dir) * distanceFrom,
        opacity: 1,
        fontSize: 20,
    }
    const to = {
        x: Math.cos(dir) * distance,
        y: Math.sin(dir) * distance,
        fontSize: 30,
        opacity: 0,
    }
    registerEffect(new AnimatedEffect({
        id: id + autoinc++,
        coordsId: id,
        value,
        animation: new Animation({
            from,
            to,
            duration,
        }),
    }))
}

