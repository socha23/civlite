const CONTEXT = new AudioContext()


export enum SoundType {
  Click = "Click",
  CollectFood = "CollectFood",
  CollectInsight = "CollectInsight",
  ResearchComplete = "ResearchComplete",
  FeedPops = "FeedPops",
  EndOfSeason = "EndOfSeason",
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

    constructor(url: string) {
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
      const source = CONTEXT.createBufferSource()
      source.buffer = this.buffer
      source.connect(CONTEXT.destination)
      source.start()  
    }
}

const Click = new Sound("click.wav")
const DjembeBass = new Sound("djembe_bass.wav")
const DjembeTone = new Sound("djembe_tone.wav")
const DjembeRoll1 = new Sound("djembe_roll1.wav")
const AztecBass = new Sound("bass_drum_aztec1.wav")


export function playSound(type: SoundType) {
  switch (type) {
    case SoundType.Click: {return Click.play()} 
    case SoundType.CollectFood: {return DjembeBass.play()} 
    case SoundType.CollectInsight: {return DjembeTone.play()} 
    case SoundType.ResearchComplete: {return DjembeRoll1.play()} 
    case SoundType.FeedPops: {return AztecBass.play()} 
    case SoundType.FeedPops: {return AztecBass.play()}   
  }
}


export const SoundDing = new Sound("cowbell.wav")
