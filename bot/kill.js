const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const Vec3 = require('vec3').Vec3;
const mineflayer = require('mineflayer');
const pvp = require('mineflayer-pvp').plugin

RANGE_GOAL=1
   async function kill(entity,bot){
    if(entity){
        await bot.lookAt(entity.position)
        const mcData = require('minecraft-data')(bot.version)
        const defaultMove = new Movements(bot, mcData)
        bot.loadPlugin(pvp)
        bot.loadPlugin(pathfinder)
        bot.pathfinder.setMovements(defaultMove)
        await bot.pathfinder.setGoal(new GoalNear(entity.position.x, entity.position.y, entity.position.z, RANGE_GOAL))
        await bot.lookAt(entity.position)
        await bot.pvp.attack(entity)
    }else{console.log("There's no entity near me.")}
}
module.exports=kill