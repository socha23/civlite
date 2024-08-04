import React, { ReactNode } from "react"
import { Amount } from "../model/amount"
import { addTickListener } from "../model/timer"
import { Colors, FontSizes } from "./icons"
import { getCoords } from "./coordsCatcher"
import { Amounts, AmountWithColorProps } from "./amount"
import { Animation } from "./animations"

type EffectValue = AmountWithColorProps[] | string | ReactNode
type FrameParams = {
    x?: number
    y?: number
    opacity?: number
    fontSize?: number
}

let autoinc = 0

class AnimatedEffect {
    id: string
    coordsId: string
    animation: Animation<FrameParams>
    value: EffectValue

    constructor(p: {
        id: string, 
        coordsId: string,
        value: EffectValue, 
        animation: Animation<FrameParams>,
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
            x: this.animation.value("x"),
            y: this.animation.value("y"),
            opacity: this.animation.value("opacity"),
            fontSize: this.animation.value("fontSize"),
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
        effects.forEach(e => {e.onTick(deltaS)})
        effects = effects.filter(e => !e.animation.complete)
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
        time: 0,
    }
    const to = {
        x: Math.cos(dir) * distance,
        y: Math.sin(dir) * distance,
        fontSize: 30,
        opacity: 0,
        time: duration,
    }
    registerEffect(new AnimatedEffect({
        id: id + autoinc++,
        coordsId: id,
        value,
        animation: new Animation(id, [from, to]),
    }))
}

