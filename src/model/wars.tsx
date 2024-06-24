export enum WarType {
  BeatemUp = "BeatemUp",
  CattleRaid = "CattleRaid",
  SlaveRaid = "SlaveRaid",
  Subjugation = "Subjugation",
}

const DEFAULT_WAR_TYPE_DEFINITION = {  
  againstStrengthFrom: 0.1,
  againstStrengthTo: 0.2,
  duration: 10,
}

const WarTypeDefinitions = {
  [WarType.BeatemUp]: {},
  [WarType.CattleRaid]: {},
  [WarType.SlaveRaid]: {},
  [WarType.Subjugation]: {},
}

export function warTypeDefinition(t: WarType) {
  return {...DEFAULT_WAR_TYPE_DEFINITION, ...WarTypeDefinitions[t]}
}
