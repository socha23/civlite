import { PopType } from "./pops"
import { ResourceType } from "./resources"

export enum WarType {
  BeatemUp = "BeatemUp",
  CattleRaid = "CattleRaid",
  SlaveRaid = "SlaveRaid",
  Subjugation = "Subjugation",
}

type Reward = {
  from: number,
  to: number,
  resourceType?: ResourceType,
  popType?: PopType,
}

const DEFAULT_WAR_TYPE_DEFINITION = {  
  againstStrengthFrom: 0.1,
  againstStrengthTo: 0.2,
  duration: 10,
  rewards: [] as Reward[],
}

const WarTypeDefinitions = {
  [WarType.BeatemUp]: {
    rewards: [{
      from: 0,
      to: 1,
      resourceType: ResourceType.Insight
    } as Reward]
  },
  [WarType.CattleRaid]: {
    rewards: [{
      from: 0.2,
      to: 0.4,
      resourceType: ResourceType.Herds
    } as Reward]
  },
  [WarType.SlaveRaid]: {},
  [WarType.Subjugation]: {},
}

export function warTypeDefinition(t: WarType) {
  return {...DEFAULT_WAR_TYPE_DEFINITION, ...WarTypeDefinitions[t]}
}
