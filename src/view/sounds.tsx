
type OptionalBuffer = AudioBuffer | undefined

const BUFFERS = {
  Click: undefined as OptionalBuffer
}


const CONTEXT = new AudioContext()

function loadBinaryFile(url: string, callback: ((b: AudioBuffer) => void)) {
  const req = new XMLHttpRequest()
  req.open("GET", url, true)
  req.responseType = 'arraybuffer'
  req.onload = () => {
    CONTEXT.decodeAudioData(req.response, callback)
  }
  req.send()
}

export function loadSounds() {
  loadBinaryFile("click.wav", (b) => {BUFFERS.Click = b})
}

function play(buffer: OptionalBuffer) {
  if (buffer) {
    const source = CONTEXT.createBufferSource()
    source.buffer = buffer
    source.connect(CONTEXT.destination)
    source.start()  
  }
}

export function soundClick() {
  play(BUFFERS.Click)
}