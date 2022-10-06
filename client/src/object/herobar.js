import * as PIXI from "pixi.js";

class HeroBar {
    constructor() {
        this.createSprites()
    }

    createSprites() {
        this._background = new PIXI.AnimatedSprite([
            PIXI.Texture.from('hero_bar_background/hero_bar_background-0.png', { scaleMode: PIXI.SCALE_MODES.NEAREST }),
        ])
        this._background.scale.set(2.1)

        this._avatar = new PIXI.AnimatedSprite([
            PIXI.Texture.from('hero_bar_avatar/hero_bar_avatar-0.png', { scaleMode: PIXI.SCALE_MODES.NEAREST }),
        ])
        this._avatar.scale.set(1.3)

        this._icon_hp = new PIXI.AnimatedSprite([
            PIXI.Texture.from('hero_bar_icon_hp/hero_bar_icon_hp-0.png', { scaleMode: PIXI.SCALE_MODES.NEAREST }),
        ])
        this._icon_hp.scale.set(1.7)
        this._icon_hp.anchor.set(0.5, 0.5)

        this._hp_back = new PIXI.AnimatedSprite([
            PIXI.Texture.from('hp_empty/hp_empty-0.png', { scaleMode: PIXI.SCALE_MODES.NEAREST }),
        ])
        this._hp_back.scale.set(2)

        this._hp_front = new PIXI.AnimatedSprite([
            PIXI.Texture.from('hp_full/hp_full-0.png', { scaleMode: PIXI.SCALE_MODES.NEAREST }),
        ])
        this._hp_front.scale.set(2)
        this._hp_front.originalWidth = this._hp_front.width

        this._level_count_text = new PIXI.Text('Уровень', new PIXI.TextStyle({ fill: 0x000000 }))
        this._level_count_text.anchor.set(0.5)
        this._level_count_text.scale.set(0.5)

        this._level_count_value = new PIXI.Text(game.hero.level, new PIXI.TextStyle({ fill: 0x000000 }))
        this._level_count_value.anchor.set(0.5)
        this._level_count_value.scale.set(0.5)

        this._exp_back = new PIXI.AnimatedSprite([
            PIXI.Texture.from('hp_empty/hp_empty-0.png', { scaleMode: PIXI.SCALE_MODES.NEAREST }),
        ])
        this._exp_back.scale.set(2)

        this._exp_front = new PIXI.AnimatedSprite([
            PIXI.Texture.from('exp_full/exp_full-0.png', { scaleMode: PIXI.SCALE_MODES.NEAREST }),
        ])
        this._exp_front.scale.set(2)
        this._exp_front.originalWidth = this._exp_front.width

        this._icon_exp = new PIXI.AnimatedSprite([
            PIXI.Texture.from('hero_bar_icon_exp/hero_bar_icon_exp-0.png', { scaleMode: PIXI.SCALE_MODES.NEAREST }),
        ])
        this._icon_exp.scale.set(1.7)
        this._icon_exp.anchor.set(0.5, 0.5)

        this._hp_status = new PIXI.Text(game.hero.health + '/' + game.hero.maxHealth,
            new PIXI.TextStyle({ fill: 0x000000 }))
        this._hp_status.scale.set(0.5)
        this._hp_status.anchor.set(0.5)

        this._exp_status = new PIXI.Text(game.hero.exp + '/' + 100 * (game.hero.level * (game.hero.expMultiply)),
            new PIXI.TextStyle({ fill: 0x000000 }))
        this._exp_status.scale.set(0.5)
        this._exp_status.anchor.set(0.5)

        this._wave_status = new PIXI.Text('Волна ' + game.wave.level, new PIXI.TextStyle({ fill: 0x000000 }))
        this._wave_status.scale.set(0.9)
        this._wave_status.anchor.set(0.5)
    }

    updateSprites() {
        let startX = game.hero.position.x - (window.innerWidth / 2) + 5
        let startY = game.hero.position.y - (window.innerHeight / 2) + 5

        this._background.x = startX
        this._background.y = startY

        this._avatar.x = startX + 25
        this._avatar.y = startY + 25

        this._icon_hp.x = startX + 25 + 75
        this._icon_hp.y = startY + 25 + 17

        this._hp_back.x = startX + 25 + 100
        this._hp_back.y = startY + 25 + 10

        this._hp_front.x = startX + 25 + 100
        this._hp_front.y = startY + 25 + 10

        let pixelHp = this._hp_front.originalWidth / game.hero.maxHealth
        this._hp_front.width = pixelHp * game.hero.health

        this._level_count_text.x = startX + 52
        this._level_count_text.y = startY + 87

        this._level_count_value.x = startX + 52
        this._level_count_value.y = startY + 100
        this._level_count_value.text = game.hero.level

        this._exp_back.x = startX + 25 + 100
        this._exp_back.y = startY + 25 + 36

        this._exp_front.x = startX + 25 + 100
        this._exp_front.y = startY + 25 + 36

        let pixelExp = this._exp_front.originalWidth / (100 * (game.hero.level * game.hero.expMultiply))
        this._exp_front.width = pixelExp * game.hero.exp

        this._icon_exp.x = startX + 25 + 75
        this._icon_exp.y = startY + 25 + 42

        this._hp_status.x = startX + 175
        this._hp_status.y = startY + 27
        this._hp_status.text = game.hero.health + '/' + game.hero.maxHealth

        this._exp_status.x = startX + 175
        this._exp_status.y = startY + 27 + 28
        this._exp_status.text = game.hero.exp + '/' + 100 * (game.hero.level * (game.hero.expMultiply))

        this._wave_status.x = startX + 175
        this._wave_status.y = startY + 95
        this._wave_status.text = 'Волна ' + game.wave.level
    }

    addSpritesToContainer(container) {
        container.addChild(this._background)
        container.addChild(this._avatar)
        container.addChild(this._icon_hp)
        container.addChild(this._hp_back)
        container.addChild(this._hp_front)
        container.addChild(this._level_count_text)
        container.addChild(this._level_count_value)
        container.addChild(this._exp_back)
        container.addChild(this._exp_front)
        container.addChild(this._icon_exp)
        container.addChild(this._hp_status)
        container.addChild(this._exp_status)
        container.addChild(this._wave_status)
    }
}

export default HeroBar