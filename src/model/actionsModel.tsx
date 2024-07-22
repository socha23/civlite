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

export function exclusiveActionsInProgress(a: Action): boolean {
    if (!a.exclusivityGroup) {
        return false
    }
    const otherAction = IN_PROGRESS_ACTIONS.find(e => e.exclusivityGroup === a.exclusivityGroup)
    return otherAction !== undefined
}