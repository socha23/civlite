import { Action } from "./action"

const IN_PROGRESS_ACTIONS : Action[] = []


export function registerInProgressAction(a: Action) {
    IN_PROGRESS_ACTIONS.push(a)
}

export function unregisterInProgressAction(a: Action) {
    if (IN_PROGRESS_ACTIONS.indexOf(a) > -1) {
        IN_PROGRESS_ACTIONS.splice(IN_PROGRESS_ACTIONS.indexOf(a), 1)

    }
}

export function listInProgressActions() {
    return IN_PROGRESS_ACTIONS
}