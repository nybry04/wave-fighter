import * as PIXI from 'pixi.js'
import Player from "./object/player";
import Hog from "./object/hog";
import {Viewport} from "pixi-viewport";
import Background from "./object/background";
import HeroSkills from "./object/heroskills";
import HeroBar from "./object/herobar";
import WaveController from "./object/wavecontroller";

if(window.localStorage.getItem('state') !== 'startgame') {
    window.location.href = '/startgame.html'
}else {
    window.localStorage.setItem('state', 'started')
}

const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight,
    backgroundColor: 0x01171C
})
document.body.appendChild(app.view)

window.game = {
    startGameTime: Date.now(),
    graphics: new PIXI.Graphics(),
    keys: {},
    wave: undefined,
    viewport: undefined,
    background: undefined,
    heroskills: undefined,
    herobar: undefined
}

app.loader
    .add('hero_idle/atlas.json')
    .add('hero_attack0/atlas.json')
    .add('hero_attack1/atlas.json')
    .add('hero_run/atlas.json')
    .add('enemy_idle/atlas.json')
    .add('enemy_damage/atlas.json')
    .add('enemy_die/atlas.json')
    .add('hp_empty/hp_empty-0.png')
    .add('hp_full/hp_full-0.png')
    .add('background/1.png')
    .add('background/2.png')
    .add('background/4.png')
    .add('background/6.png')
    .add('keyboard_i/atlas.json')
    .add('keyboard_o/atlas.json')
    .add('keyboard_p/atlas.json')
    .add('hero_block/atlas.json')
    .add('hero_bar_avatar/atlas.json')
    .add('hero_bar_background/atlas.json')
    .add('hero_bar_icon_exp/atlas.json')
    .add('hero_bar_icon_hp/atlas.json')
    .add('exp_full/exp_full-0.png')
    .add('enemy_run/atlas.json')
    .add('enemy_attack0/atlas.json')
    .add('hero_damage/atlas.json')
    .add('burning/atlas.json')
    .load(loadComplete)

function loadComplete() {
    game.viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1000,
        worldHeight: 1000,

        interaction: app.renderer.plugins.interaction
    })

    app.stage.addChild(game.viewport)
    app.stage.addChild(game.graphics)

    game.background = new Background(game.viewport, 0, -470)

    game.background
        .multiply(1)
        .addLayer('background/1.png', 0.09 * 2)
        .addLayer('background/2.png', 0.09)
        .addLayer('background/4.png', 0)
        .addLayer('background/6.png', 0)
        .done()

    let player = new Player()
    player.setPosition(1060, 0)
    player.addSpritesToContainer(game.viewport)
    window.game.hero = player

    game.wave = new WaveController(game.viewport)

    let heroskils = new HeroSkills()
    heroskils.addSpritesToContainer(game.viewport)
    window.game.heroskills = heroskils

    let herobar = new HeroBar()
    herobar.addSpritesToContainer(game.viewport)
    window.game.herobar = herobar

    game.viewport.follow(player._sprite)

    app.ticker.add(gameLoop)
    document.addEventListener('keydown', (key) => {
        // A
        if(key.keyCode === 65){
            game.keys['left'] = true
        }
        // D
        if(key.keyCode === 68) {
            game.hero.setInvert(false)
            game.keys['right'] = true
        }
        // I - attack0
        if(key.keyCode === 73) {
            game.keys['attack0'] = true
        }
        // O - attack1
        if(key.keyCode === 79) {
            game.keys['attack1'] = true
        }
        // P - block
        if(key.keyCode === 80) {
            game.keys['block'] = true
        }
    })

    document.addEventListener('keyup', (key) => {
        // A
        if(key.keyCode === 65){
            game.keys['left'] = false
        }
        // D
        if(key.keyCode === 68) {
            game.keys['right'] = false
        }
        // I - attack0
        if(key.keyCode === 73) {
            game.keys['attack0'] = false
        }
        // O - attack1
        if(key.keyCode === 79) {
            game.keys['attack1'] = false
        }
        // P - block
        if(key.keyCode === 80) {
            game.keys['block'] = false
        }
    })
}

function gameLoop(delta) {
    if(game.hero === undefined) return
    if(game.wave === undefined) return
    renderAreas()
    game.heroskills.updateSprites()
    game.herobar.updateSprites()

    game.wave.update()

    for(let i = 0; i < game.wave.entities.length; i++) {
        game.wave.entities[i].update()
    }

    if(game.hero._sprite.currentAnimation === 'damage_animation') return;


    if(game.keys['block']) {
        game.hero.block(true)
    }else {
        game.hero.block(false)
    }

    if(game.keys['right']) {
        game.hero.setInvert(false)
        if(game.hero.skill.block.pressed) return;
        if(game.hero.position.x > 5250) return
        game.hero.playAnimation('run_animation')
        game.hero.setPosition(game.hero.position.x + game.hero.speed * delta, game.hero.position.y)
        game.background.moveAll(game.hero.speed * delta)
    }else if(game.keys['left']) {
        game.hero.setInvert(true)
        if(game.hero.skill.block.pressed) return;
        if(game.hero.position.x < 900) return
        game.hero.playAnimation('run_animation')
        game.hero.setPosition(game.hero.position.x - game.hero.speed * delta, game.hero.position.y)
        game.background.moveAll(-(game.hero.speed * delta))
    } else if(game.keys['attack0']) {
        if(game.hero.skill.block.pressed) return;
        game.hero.attack(game.hero.skill.attack0)
    } else if(game.keys['attack1']) {
        if(game.hero.skill.block.pressed) return;
        game.hero.attack(game.hero.skill.attack1)
    } else {
        if(game.hero.skill.block.pressed) return;
        if(game.hero._sprite.currentAnimation === 'attack0_animation') return
        if(game.hero._sprite.currentAnimation === 'attack1_animation') return
        if(game.hero._sprite.currentAnimation === 'damage_animation') return
        game.hero.playAnimation('idle_animation')
    }
}

function renderAreas() {
    let areas = []
    for (let entityI in game.wave.entities) {
        for(let areaI in game.wave.entities[entityI]._areas) {
            let area = game.wave.entities[entityI].getArea(areaI)

            if(area.visible) {
                areas.push(area)
            }
        }
    }

    game.graphics.clear()
    for (let area in areas) {
        let rect = areas[area].rect
        game.graphics.beginFill(areas[area].color)
        game.graphics.drawRect(rect.x, rect.y, rect.width, rect.height)
        game.graphics.endFill()
    }

}