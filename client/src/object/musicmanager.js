import {Howl} from 'howler'

class MusicManager {
    constructor() {
        this.list = {}
    }

    add(name, file, autoplay = false, loop = false, volume = 0.5) {
        this.list[name] = new Howl({
            src: [file],
            autoplay,
            loop,
            volume
        })
        return this
    }

    play(name) {
        this.list[name].play()
    }
}

export default MusicManager