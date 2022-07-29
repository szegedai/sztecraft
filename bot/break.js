const Vec3 = require('vec3').Vec3;
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const collectBlock = require('mineflayer-collectblock').plugin
const toolPlugin = require('mineflayer-tool').plugin

function wait (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

async function breakblock(bot, blocks){    
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(toolPlugin)
    bot.loadPlugin(collectBlock)
    try {
        console.log("Collecting")
        await bot.collectBlock.collect(blocks)
        await wait(1000)
      } catch (err) {
        bot.chat(err.message)
        console.log(err)
      }
}

module.exports=breakblock