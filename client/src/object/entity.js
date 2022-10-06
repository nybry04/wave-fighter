import * as PIXI from 'pixi.js'
import {v4 as uuidv4} from 'uuid'

class Entity {
    constructor(health, level, speed, skill) {
        this.container = undefined
        this.uuid = uuidv4()
        this.health = health * level
        this.healthStep = 100
        this.maxHealth = this.healthStep * level
        this.level = level
        this.exp = 0
        this.expMultiply = 1.5
        this.speed = speed
        this.minSpeed = speed / 2
        this.maxSpeed = speed + speed / 2
        this.skill = skill
        this.position = { x: 0, y: 0 }
        this.invert = false
        this._textures = {}
        this._animations = {}
        this._areas = {}
        this._sprite = undefined
        this._renderHealth = undefined
        this._spriteList = []

    }

    getSpriteList() {
        this._spriteList = []
        this._spriteList.push(this._sprite)
        this._spriteList.push(this._renderHealth)
        return this._spriteList
    }

    remove() {
        let sprites = this.getSpriteList()
        for(let i = 0; i < sprites.length; i++) {
            try {
                sprites[i].destroy()
            }catch (e) {}
        }
    }

    addSpritesToContainer(container) {
        this.container = container
        let sprites = this.getSpriteList()
        for(let i = 0; i < sprites.length; i++) {
            container.addChild(sprites[i])
        }
    }

    _createRenderHealth() {
        this._renderHealth = new PIXI.Text(this.health + '%', undefined, undefined)
        this._renderHealth.style = new PIXI.TextStyle({fill: 0xFF0000, fontSize: 25, fontFamily: 'DungeonFont'})
        this._renderHealth.x = this.position.x;
        this._renderHealth.y = this.position.y - 150;
    }

    updateRenderHealth() {
        if(this._renderHealth === undefined) return
        this._renderHealth.text = this.health + '%'
        this._renderHealth.updateText(true)
        this._renderHealth.x = this.position.x - 10;
        this._renderHealth.y = this.position.y - 50;

    }

    setHealth(health) {
        this.health = health
        this.updateRenderHealth()
    }

    getRenderHealth() {
        return this._renderHealth
    }

    setPosition(x, y) {
        this.position = { x, y }
        this._sprite.x = x
        this._sprite.y = y

        this.updateRenderHealth()

        for(let areaI in this._areas) {
            this._areas[areaI].rect.x = x + this._areas[areaI].addX
            this._areas[areaI].rect.y = y + this._areas[areaI].addY
        }
    }

    _setTexture(name, texture, frames) {
        this._textures[name] = []

        for(let i = 0; i < frames; i++) {
            const t = PIXI.Texture.from(texture + '/' + texture + '-' + i + '.png', { scaleMode: PIXI.SCALE_MODES.NEAREST })
            this._textures[name].push(t)
        }
    }

    _createSprite(animationName) {
        this._sprite = new PIXI.AnimatedSprite(this._textures[this._animations[animationName].textureName])
        this._setupAnimation(animationName)
    }

    _createAnimation(name, textureName, loop, scale, anchorX, anchorY, animationSpeed) {
        this._animations[name] = {
            textureName,
            loop,
            scale,
            anchorX,
            anchorY,
            animationSpeed
        }
    }

    _setupAnimation(animationName) {
        this._sprite.currentAnimation = animationName
        this._sprite.scale.set(this._animations[animationName].scale)
        this._sprite.anchor.x = this._animations[animationName].anchorX
        this._sprite.anchor.y = this._animations[animationName].anchorY
        this._sprite.loop = this._animations[animationName].loop
        this._sprite.x = this.position.x
        this._sprite.y = this.position.y
        this._sprite.animationSpeed = this._animations[animationName].animationSpeed
        this._sprite.gotoAndPlay(0)
        this._updateInvert()
    }

    _updateInvert() {
        this._sprite.scale.x = this.invert ? -(this._animations[this._sprite.currentAnimation].scale) : this._animations[this._sprite.currentAnimation].scale
    }

    setInvert(bool) {
        this.invert = bool
        this._updateInvert()
    }

    playAnimation(animationName, options = { onFrameChange: undefined, onComplete: undefined }) {
        if(this._sprite.currentAnimation !== animationName) {
            this._sprite.textures = this._textures[this._animations[animationName].textureName]
            this._sprite.onFrameChange = options.onFrameChange
            this._sprite.onComplete = options.onComplete
            this._setupAnimation(animationName)
        }
    }

    setArea(name, x, addX, y, addY, w, h, color = 0xFF0000) {
        this._areas[name] = {
            rect: new PIXI.Rectangle(x, y, w, h),
            addX, addY,
            color,
            visible: false
        }
    }

    setAreaVisible(name, state) {
        this._areas[name].visible = state
    }

    getArea(name) {
        return this._areas[name]
    }

    getSprite() {
        return this._sprite
    }
}

export default Entity