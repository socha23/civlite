const CONTEXT = new AudioContext()


export enum SoundType {
  Click = "Click",
  CollectFood = "CollectFood",
  CollectInsight = "CollectInsight",
  ResearchComplete = "ResearchComplete",
  OpenPack = "OpenPack",
  FeedPops = "FeedPops",
  EndOfSeason = "EndOfSeason",
  NewPop = "NewPop",
}

/*
120 BPM
= note = 0.5s

four = 2s
eight = 4s 
...
*/

class Sound {
  
    buffer?: AudioBuffer
    gain: number

    constructor(url: string, gain: number = 1) { 
      this.gain = gain
      const req = new XMLHttpRequest()
      req.open("GET", url, true)
      req.responseType = 'arraybuffer'
      req.onload = () => {
        CONTEXT.decodeAudioData(req.response, b => {this.buffer = b})
      }
      req.send()
    
    }

    play() {
      if (!this.buffer) {
        return
      }

      const gainNode = CONTEXT.createGain()
      gainNode.connect(CONTEXT.destination)
      gainNode.gain.value = this.gain


      const source = CONTEXT.createBufferSource()
      source.buffer = this.buffer
      source.connect(gainNode)
      
      source.start()  
    }
}

const Click = new Sound("click.wav")
const DjembeBass = new Sound("djembe_bass.wav")
const DjembeTone = new Sound("djembe_tone.wav")
const DjembeRoll1 = new Sound("djembe_roll1.wav")
const AztecBass1 = new Sound("bass_drum_aztec1.wav")
const AztecBass2 = new Sound("bass_drum_aztec2.wav")
const CongaRoll1 = new Sound("conga_roll1.wav")
const CongaRoll2 = new Sound("conga_roll2.wav")
const Castagnette = new Sound("castagnette1.wav", 0.5)


export function playSound(type: SoundType) {
  switch (type) {
    case SoundType.Click: {return Click.play()} 
    case SoundType.CollectFood: {return Castagnette.play()} 
    case SoundType.CollectInsight: {return DjembeTone.play()} 
    case SoundType.ResearchComplete: {return DjembeRoll1.play()} 
    case SoundType.FeedPops: {return AztecBass1.play()} 
    case SoundType.NewPop: {return CongaRoll2.play()}   
    case SoundType.OpenPack: {return CongaRoll1.play()}
  }
}


export const SoundDing = new Sound("cowbell.wav")
