import Hog from "./hog";

class WaveController {
    constructor(container) {
        this.level = 0
        this.entities = []
        this._container = container
    }

    spawn() {
        this.level += 1
        game.hero.health = game.hero.maxHealth
        for(let i = 0; i < this.level + 2; i++) {
            let hog = new Hog(game.hero.level + 1)
            hog.addSpritesToContainer(this._container)
            hog.speed = (Math.floor(Math.random() * (hog.maxSpeed * 1000 - hog.minSpeed * 1000 + 1)) + hog.minSpeed * 1000) / 1000
            hog.skill.attack0.nextSkillUsage = Date.now() + Math.floor(Math.random() * (hog.skill.attack0.cooldown - 0 + 1)) + 0
        }
    }

    update() {
        if(this.entities.length === 0) this.spawn()
    }
}

export default WaveController