let autoinc = 0

export type AnimationFrame<T> = T & {time: number}

export class Animation<T> {
    id: string
    lifetime: number = 0

    frames: AnimationFrame<T>[]

    constructor(id: string, frames: AnimationFrame<T>[]) {
        this.id = id || "_animation" + autoinc++
        this.frames = frames      
    }

    get duration() {
        return this.frames[this.frames.length - 1].time
    }

    onTick(deltaS: number) {
        this.lifetime += deltaS
    }

    get complete() {
        return this.lifetime > this.duration
    }

    value(id: keyof T): number {
        let lastValue = 0
        let lastTime = 0
        for (let i = 0; i < this.frames.length; i++) {
            const f = this.frames[i]
            const val = f[id]
            if (val !== undefined) {
                if (f.time < this.lifetime) {
                    lastTime = f.time
                    if (typeof val === "number") {
                        lastValue = val
                    }
                } else {
                    const timeSinceLast = this.lifetime - lastTime
                    const totalTimePerChange = f.time - lastTime
                    if (typeof val === "number") {
                        return lastValue + (val - lastValue) * (timeSinceLast / totalTimePerChange)
                    }
                }
            }
        }
        return lastValue
    }
}

