import * as PIXI from 'pixi.js'

class HeroSkills {
    constructor() {
        this.createSprites()
    }

    createSprites() {
        this._keyboard_i = new PIXI.AnimatedSprite([
            PIXI.Texture.from('keyboard_i/keyboard_i-0.png', { scaleMode: PIXI.SCALE_MODES.NEAREST }),
            PIXI.Texture.from('keyboard_i/keyboard_i-1.png', { scaleMode: PIXI.SCALE_MODES.NEAREST })
        ])
        this._keyboard_i.anchor.x = 0.5
        this._keyboard_i.anchor.x = 0.5
        this._keyboard_i.scale.set(3.5)

        this._keyboard_i_cooldown = new PIXI.Text('0', new PIXI.TextStyle({ fill: 0xFFFFFF }))
        this._keyboard_i_cooldown.anchor.x = 0.5
        this._keyboard_i_cooldown.anchor.x = 0.5
        this._keyboard_i_cooldown.visible = false

        this._keyboard_o = new PIXI.AnimatedSprite([
            PIXI.Texture.from('keyboard_o/keyboard_o-0.png', { scaleMode: PIXI.SCALE_MODES.NEAREST }),
            PIXI.Texture.from('keyboard_o/keyboard_o-1.png', { scaleMode: PIXI.SCALE_MODES.NEAREST })
        ])
        this._keyboard_o.anchor.x = 0.5
        this._keyboard_o.anchor.x = 0.5
        this._keyboard_o.scale.set(3.5)

        this._keyboard_o_cooldown = new PIXI.Text('0', new PIXI.TextStyle({ fill: 0xFFFFFF }))
        this._keyboard_o_cooldown.anchor.x = 0.5
        this._keyboard_o_cooldown.anchor.x = 0.5
        this._keyboard_o_cooldown.visible = false

        this._keyboard_p = new PIXI.AnimatedSprite([
            PIXI.Texture.from('keyboard_p/keyboard_p-0.png', { scaleMode: PIXI.SCALE_MODES.NEAREST }),
            PIXI.Texture.from('keyboard_p/keyboard_p-1.png', { scaleMode: PIXI.SCALE_MODES.NEAREST })
        ])
        this._keyboard_p.anchor.x = 0.5
        this._keyboard_p.anchor.x = 0.5
        this._keyboard_p.scale.set(3.5)
    }

    updateSprites() {
        let startY = game.hero.position.y + (window.innerHeight / 2)

        this._keyboard_i.x = game.hero.position.x - 100
        this._keyboard_i.y = startY - 70

        this._keyboard_i_cooldown.x = game.hero.position.x - 100
        this._keyboard_i_cooldown.y = startY - 100

        if(game.hero.skill.attack0.nextSkillUsage - Date.now() < 0) {
            this._keyboard_i.gotoAndStop(0)
            this._keyboard_i_cooldown.visible = false
        }else {
            this._keyboard_i.gotoAndStop(1)
            this._keyboard_i_cooldown.visible = true
            this._keyboard_i_cooldown.text = ((game.hero.skill.attack0.nextSkillUsage - Date.now()) / 1000).toFixed(1)
        }

        this._keyboard_o.x = game.hero.position.x
        this._keyboard_o.y = startY - 70

        this._keyboard_o_cooldown.x = game.hero.position.x
        this._keyboard_o_cooldown.y = startY - 100

        if(game.hero.skill.attack1.nextSkillUsage - Date.now() < 0) {
            this._keyboard_o.gotoAndStop(0)
            this._keyboard_o_cooldown.visible = false
        }else {
            this._keyboard_o.gotoAndStop(1)
            this._keyboard_o_cooldown.visible = true
            this._keyboard_o_cooldown.text = ((game.hero.skill.attack1.nextSkillUsage - Date.now()) / 1000).toFixed(1)
        }

        this._keyboard_p.x = game.hero.position.x + 100
        this._keyboard_p.y = startY - 70

        if(game.hero.skill.block.pressed) {
            this._keyboard_p.gotoAndStop(1)
        }else {
            this._keyboard_p.gotoAndStop(0)
        }
    }

    addSpritesToContainer(container) {
        container.addChild(this._keyboard_i)
        container.addChild(this._keyboard_i_cooldown)

        container.addChild(this._keyboard_o)
        container.addChild(this._keyboard_o_cooldown)

        container.addChild(this._keyboard_p)
    }
}

export default HeroSkills