import { ReactNode } from "react"

export type LogMessage = {
    message: ReactNode
    idx: number
}

export class Log {
    nextMessageId = 0    
    _messages: LogMessage[]

    constructor() {
        this._messages = []
    }

    info(message: ReactNode) {
        this._messages.push({message: message, idx: this.nextMessageId++})
    }

    get messages() {
        return this._messages
    }

}