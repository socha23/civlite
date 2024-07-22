import React, { ReactNode } from "react"
import { Amount } from "../model/amount"
import { addTickListener } from "../model/timer"
import { gaussRandom } from "../model/utils"
import { Colors, FontSizes } from "./icons"
import { getCoords } from "./elementCoordinatesHolder"
import { Amounts, AmountWithColorProps } from "./amount"

type EffectValue = AmountWithColorProps[] | string | ReactNode


type Effect = {
    id: string
    coordsRef: string
    value: EffectValue
    direction: number
    speed: number
    lifetime: number
    lifetimeMax: number 
}

let autoinc  = 0


export function spawnEffectNumberIncrease(id: string, value: number, size: number = FontSizes.normal) {
    return spawnEffect(id, <span style={{fontSize: size, color: Colors.award}}>+{value}</span>)
}

export function spawnEffectCost(id: string, value: Amount[]) {
    return spawnEffect(id, value.map(v => ({color: Colors.cost, ...v})))
}

export function spawnEffectAwards(id: string, value: Amount[]) {
    return spawnEffect(id, value.map(v => ({color: Colors.award, ...v})))
}

export function spawnEffect(id: string, value: EffectValue) {
    registerEffect({
        id: id + autoinc++,
        coordsRef: id,
        value: value,
        direction: -Math.PI / 2 + Math.random() * Math.PI,
        speed: gaussRandom(10, 20),
        lifetime: 0,
        lifetimeMax: 1
    })
}

let effects = [] as Effect[]

function registerEffect(e: Effect) {
    effects.push(e)
}

export function currentEffects() {
    return effects
}

addTickListener({
    onTick(deltaS: number) {
        const newEffects = [] as Effect[]
        effects.forEach(e => {
            e.lifetime += deltaS
            if (e.lifetime < e.lifetimeMax) {
                newEffects.push(e)
            } else {
            }
        })
        effects = newEffects
    }
})

const Effect = (e: Effect) => {
    const coords = getCoords(e.coordsRef)
    if (coords) {
        const top = coords.top + Math.sin(e.direction) * e.lifetime * e.speed
        const left = coords.left + coords.width - 10 + Math.cos(e.direction) * e.lifetime * e.speed

        return <div style={{
            fontSize: FontSizes.normalPlus,
            fontWeight: "bold",
            position: "absolute",
            top: top,
            left: left,
            opacity: 1 - e.lifetime / e.lifetimeMax,
        }}>
            {
                (Array.isArray(e.value)) ? <Amounts items={e.value}/> : e.value 
            }
        </div>
    } else {
        return <div/>
    }

}

export const Effects = ({}) => {
    return <div style={{
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 10,
    }}>
        {
            effects.map(e => <Effect key={e.id} {...e}/>)
        }
    </div>
}