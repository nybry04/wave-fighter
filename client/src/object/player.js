import * as PIXI from 'pixi.js'
import Entity from "./entity";

class Player extends Entity {
    constructor() {
        super(100, 1, 10, {
            attack0: {
                name: 'attack0',
                cooldown: 0.5 * 1000,
                damage: 10,
                damageFrame: 3,
                skillAnimation: 'attack0_animation',
                nextSkillUsage: 0
            },
            attack1: {
                name: 'attack1',
                cooldown: 10 * 1000,
                damage: 40,
                damageFrame: 11,
                skillAnimation: 'attack1_animation',
                nextSkillUsage: 0
            },
            block: {
                name: 'block',
                skillAnimation: 'block_animation',
                pressed: false
            }
        });
        this._createRenderHealth();
        this._setTexture('idle', 'hero_idle', 8)
        this._setTexture('run', 'hero_run', 7)
        this._setTexture('attack0', 'hero_attack0', 7)
        this._setTexture('attack1', 'hero_attack1', 17)
        this._setTexture('block', 'hero_block', 3)
        this._setTexture('damage', 'hero_damage', 5)
        this._createAnimation(
            'idle_animation',
            'idle',
            true,
            3.5,
            0.7,
            0,
            0.15
        )
        this._createAnimation(
            'run_animation',
            'run',
            true,
            3.5,
            0.7,
            0,
            0.15
        )
        this._createAnimation(
            'attack0_animation',
            'attack0',
            false,
            3.5,
            0.2,
            0.25,
            0.17 //.17
        )
        this._createAnimation(
            'attack1_animation',
            'attack1',
            false,
            3.5,
            0.2,
            0.6,
            0.15
        )
        this._createAnimation(
            'block_animation',
            'block',
            false,
            3.5,
            0.69,
            0.023,
            0.2
        )
        this._createAnimation(
            'damage_animation',
            'damage',
            false,
            3.5,
            0.8,
            0.2,
            0.2
        )
        this._createSprite('idle_animation')

        this.setArea('hitbox', this.position.x, -50, this.position.y, 0, 100, 154)

        this.setArea('attack_right', this.position.x, 60, this.position.y, 0, 300, 154, 0x00FF00)
        this.setArea('attack_left', this.position.x, -340, this.position.y, 0, 300, 154, 0x00FF00)
    }

    getSpriteList() {
        this._spriteList = []
        this._spriteList.push(this._sprite)
        return this._spriteList
    }

    updateRenderHealth() {}

    addExp(count) {
        this.exp += count

        while(this.exp >= 100 * this.level * this.expMultiply) {
            this.exp -= 100 * this.level * this.expMultiply
            this.level += 1

            this.skill.attack0.damage += 5
            this.skill.attack1.damage += 10
        }

        this.maxHealth = this.healthStep * this.level
    }

    attack(skill) {
        if(this.skill[skill.name].nextSkillUsage - Date.now() > 0) return
        let options = {
            onFrameChange: (currentFrame) => {
                if(currentFrame === skill.damageFrame) {
                    this.skill[skill.name].nextSkillUsage = Date.now() + this.skill[skill.name].cooldown
                    let attackSide = game.hero.invert ?
                        game.hero.getArea('attack_left') : game.hero.getArea('attack_right')

                    for(let i = 0; i < game.wave.entities.length; i++) {
                        if(game.wave.entities[i].makeDamage === undefined) continue
                        let area = game.wave.entities[i].getArea('hitbox')

                        if(attackSide.rect.intersects(area.rect)) {
                            game.wave.entities[i].makeDamage(skill.damage)
                            if(skill.name === 'attack1') {
                                game.wave.entities[i].burning.time = 5
                                game.wave.entities[i].burning.damage = this.skill.attack1.damage / 10
                            }
                        }
                    }
                }
            },
            onComplete: () => {
                game.hero.playAnimation('idle_animation')
            }
        }
        game.hero.playAnimation(skill.skillAnimation, options)
    }

    block(bool) {
        if(bool && !this.skill.block.pressed) {
            this.skill.block.pressed = bool
            this.playAnimation(this.skill.block.skillAnimation)
        } else {
            this.skill.block.pressed = bool
            //this.playAnimation(this._animations['idle_animation'])
        }
    }

    die() {
        this.health = 0
        window.localStorage.setItem('state', 'endgame')
        window.localStorage.setItem('time', Math.round((Date.now() / 1000) - (game.startGameTime / 1000).toString()))
        window.localStorage.setItem('wavelevel', game.wave.level)
        window.localStorage.setItem('level', game.hero.level)
        window.location.reload()
    }

    makeDamage(count) {
        if(this.skill.block.pressed) return
        this.health -= count
        if(this.health < 1) {
            this.die()
        } else {
            if(this._sprite.currentAnimation === 'attack1_animation') return
            this.playAnimation('damage_animation', {
                onComplete: () => {
                    this.playAnimation('idle_animation')
                }
            })
        }
    }
}

export default Player