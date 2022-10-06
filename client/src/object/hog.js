import * as PIXI from 'pixi.js'
import Entity from "./entity";

class Hog extends Entity{
    constructor(level) {
        super(100, level, 5, {
            attack0: {
                name: 'attack0',
                cooldown: 3 * 1000,
                damage: 5 * level,
                damageFrame: 2,
                radius: 250,
                skillAnimation: 'attack0_animation',
                nextSkillUsage: 0
            }
        });
        game.wave.entities.push(this)
        this._setTexture('idle', 'enemy_idle', 5)
        this._setTexture('damage', 'enemy_damage', 3)
        this._setTexture('die', 'enemy_die', 6)
        this._setTexture('run', 'enemy_run', 8)
        this._setTexture('attack0', 'enemy_attack0', 8)

        this._setTexture('hp_empty', 'hp_empty', 1)
        this._setTexture('hp_full', 'hp_full', 1)

        this._setTexture('burning', 'burning', 8)

        this._createAnimation(
            'idle_animation',
            'idle',
            true,
            3.5,
            0.35, 0,
            0.1
        )
        this._createAnimation(
            'damage_animation',
            'damage',
            false,
            3.5,
            0.35, 0,
            0.20
        )
        this._createAnimation(
            'die_animation',
            'die',
            false,
            3.5,
            0, 0,
            0.2
        )
        this._createAnimation(
            'run_animation',
            'run',
            true,
            3.5,
            0.39, 0,
            0.15
        )
        this._createAnimation(
            'attack0_animation',
            'attack0',
            false,
            3.5,
            0.25, 0.25,
            0.15
        )
        this._createAnimation(
            'burning_animation',
            'burning',
            true,
            3.5,
            0.5, 0,
            0.25
        )
        this._createSprite('idle_animation')

        this.setArea('hitbox', this.position.x, -50, this.position.y, 0, 100, 147)

        this.onDie = undefined
        this.burning = {
            time: 0,
            nextTick: 0,
            damage: 0
        }
        this.damageParticle = []
        this._createRenderHealth()
    }

    getSpriteList() {
        this._spriteList = []
        this._spriteList.push(this._sprite)
        this._spriteList.push(this._burning)
        this._spriteList.push(this._renderHealthBack)
        this._spriteList.push(this._renderHealth)
        this._spriteList.push(this._levelCount)
        return this._spriteList
    }

    _createRenderHealth() {
        this._renderHealthBack = new PIXI.AnimatedSprite(this._textures['hp_empty'])
        this._renderHealthBack.scale.set(2.5)

        this._renderHealth = new PIXI.AnimatedSprite(this._textures['hp_full'])
        this._renderHealth.scale.set(2.5)
        this._renderHealth.originalWidth = this._renderHealth.width;

        this._levelCount = new PIXI.Text(this.level + ' уровень', new PIXI.TextStyle({ fill: 0xFFFFFF }))
        this._levelCount.anchor.set(0.5, 0.5)
        this._levelCount.scale.set(0.7)

        this._burning = new PIXI.AnimatedSprite(this._textures[this._animations['burning_animation'].textureName])
        this._burning.visible = this.burning.time > 0
        this._burning.anchor.x = this._animations['burning_animation'].anchorX
        this._burning.anchor.y = this._animations['burning_animation'].anchorY
        this._burning.animationSpeed = this._animations['burning_animation'].animationSpeed
        this._burning.scale.set(5)
        this._burning.gotoAndPlay(0)
    }

    updateRenderHealth() {
        if(this._renderHealthBack !== undefined) {
            this._renderHealthBack.x = this.position.x - this._renderHealthBack.width / 2
            this._renderHealthBack.y = this.position.y - 40
        }

        if(this._renderHealth !== undefined) {
            this._renderHealth.x = this.position.x - this._renderHealth.originalWidth / 2
            this._renderHealth.y = this.position.y - 40

            let pixel = this._renderHealth.originalWidth / this.maxHealth
            this._renderHealth.width = pixel * this.health
        }

        if(this._levelCount !== undefined) {
            this._levelCount.text = this.level + ' уровень'
            this._levelCount.x = this.position.x
            this._levelCount.y = this.position.y - 10
        }

        if(this._burning !== undefined) {
            this._burning.x = this.position.x
            this._burning.y = this.position.y
            this._burning.visible = this.burning.time > 0
        }
    }

    spawnDamageParticle(damageCount) {
        let particle = new PIXI.Text('-' + damageCount, new PIXI.TextStyle({ fill: '0xFFFFFF' }))
        particle.y = this.position.y + 50
        particle.anchor.set(0.5, 0.5)

        this.damageParticle.push({
            sprite: particle,
            randomX: Math.floor(Math.random() * (50 - -50 + 1)) + -50,
            lifetime: Date.now() + 2000,
            speed: 1
        })

        this.container.addChild(particle)
    }

    updateDamageParticles() {
        if(this.health < 1) return
        let remove = false
        for(let i = 0; i < this.damageParticle.length; i++) {
            if(this.damageParticle[i].lifetime - Date.now() < 0) {
                this.damageParticle[i].sprite.destroy()
                this.damageParticle[i].sprite = undefined
                remove = true
            } else {
                this.damageParticle[i].sprite.x = this.position.x + this.damageParticle[i].randomX
                this.damageParticle[i].sprite.y = this.damageParticle[i].sprite.y - this.damageParticle[i].speed
            }
        }

        if(remove) {
            this.damageParticle = this.damageParticle.filter((value) => {
                return value.sprite !== undefined
            })
        }
    }

    makeDamage(damageCount) {
        if(this.health < 1) return
        this.spawnDamageParticle(damageCount)
        this.playAnimation('damage_animation', {
            onComplete: () => {
                let nHealth = this.health - damageCount
                this.setHealth(nHealth < 1 ? 0 : nHealth)
                if(nHealth < 1) {
                    this.playAnimation('die_animation', {
                        onComplete: () => {
                            game.hero.addExp(this.level * 50)
                            if(this.onDie !== undefined) this.onDie()
                            for(let i = 0; i < game.wave.entities.length; i++) {
                                if(game.wave.entities[i].uuid === this.uuid) {
                                    for(let i = 0; i < this.damageParticle.length; i++) {
                                        this.damageParticle[i].sprite.destroy()
                                    }
                                    this.damageParticle = []
                                    this.remove()
                                    game.wave.entities = game.wave.entities.filter((value) => value.uuid !== this.uuid)
                                }
                            }
                        }
                    })
                }else {
                    this.playAnimation('idle_animation')
                }
            }
        })
    }

    burnUpdate() {
        if(this.burning.time > 0 && this.burning.nextTick - Date.now() < 0) {
            this.burning.time--
            this.makeDamage(this.burning.damage)
            this.burning.nextTick = Date.now() + 1000
        }
    }

    update() {
        this.updateDamageParticles()
        if(this._sprite.currentAnimation === 'die_animation') return
        this.burnUpdate()
        if(this._sprite.currentAnimation === 'damage_animation') return
        if(this._sprite.currentAnimation === 'attack0_animation') return

        this.movement()
    }

    movement() {
        if(this._randomPosition === undefined) {
            this._randomPosition = Math.floor(Math.random() * (100 - 0 + 1)) + 0
        }
        if((game.hero.position.x - this.position.x) < 0) {
            this.setInvert(true)
            if(game.hero.position.x - this.position.x > -100 - this._randomPosition) {
                if(game.hero.position.x - this.position.x < this.skill.attack0.radius) {
                    this.attack(this.skill.attack0)
                    return
                }else {
                    if(this._sprite.currentAnimation === 'idle_animation') return
                    this.playAnimation('idle_animation')
                    return
                }
            }
            this.setPosition(this.position.x - this.speed, this.position.y)
        }else {
            this.setInvert(false)
            if(game.hero.position.x - this.position.x < 100 + this._randomPosition) {
                if(game.hero.position.x - this.position.x < this.skill.attack0.radius) {
                    this.attack(this.skill.attack0)
                    return
                }else {
                    if(this._sprite.currentAnimation === 'idle_animation') return
                    this.playAnimation('idle_animation')
                    return
                }
            }
            this.setPosition(this.position.x + this.speed, this.position.y)
        }

        if(this._sprite.currentAnimation === 'run_animation') return

        this.playAnimation('run_animation')
    }

    attack(skill) {
        if(this.skill[skill.name].nextSkillUsage - Date.now() > 0) return
        this.playAnimation('attack0_animation', {
            onFrameChange: (currentFrame) => {
                if(currentFrame === this.skill[skill.name].damageFrame){
                    this.skill[skill.name].nextSkillUsage = Date.now() + this.skill[skill.name].cooldown
                    game.hero.makeDamage(this.skill[skill.name].damage)
                }
            },
            onComplete: () => {
                this.playAnimation('idle_animation')
            }
        })
    }
}

export default Hog