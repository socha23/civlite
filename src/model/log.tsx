enum LogLevel {
    Trace = 0,
    Info = 1,
}



export type LogMessage = {
    level: LogLevel
    message: string
}

export class Log {
    _messages: LogMessage[]

    constructor() {
        this._messages = []
    }

    info(message: string) {
        this.log(message, LogLevel.Info)
    }

    trace(message: string) {
        this.log(message, LogLevel.Trace)
    }

    log(message: string, level: LogLevel) {
        this._messages.push({message: message, level: level})
    }

    get messages() {
        return this._messages.map(m => m.message)
    }

}