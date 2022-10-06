import * as PIXI from 'pixi.js'

class Background {
    constructor(container, x, y) {
        this.container = container
        this.x = x
        this.y = y
        this.layers = []
        this.renderLayers = []
        this.mCount = 1
    }

    addLayer(texture, moveSpeed) {
        this.layers.push({texture, moveSpeed})
        return this
    }

    multiply(count) {
        this.mCount = count
        return this
    }

    done() {
        for(let i = 0; i < this.mCount; i++) {
            this.renderLayers.push(this.layers)
        }

        for(let i = 0; i < this.renderLayers.length; i++) {
            for (let j = 0; j < this.renderLayers[i].length; j++) {
                this.renderLayers[i][j].sprite = PIXI.Sprite.from(this.renderLayers[i][j].texture)
                this.renderLayers[i][j].sprite.scale.set(2)
                this.renderLayers[i][j].sprite.y = this.y
                this.renderLayers[i][j].sprite.x = this.renderLayers[i][j].sprite.width * i
                this.container.addChild(this.renderLayers[i][j].sprite)
            }
        }
    }

    moveAll(addX) {
        for(let i = 0; i < this.renderLayers.length; i++) {
            for (let j = 0; j < this.renderLayers[i].length; j++) {
                this.renderLayers[i][j].sprite.x = this.renderLayers[i][j].sprite.x + addX * this.renderLayers[i][j].moveSpeed
            }
        }
    }
}

export default Background