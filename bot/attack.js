const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const Vec3 = require('vec3').Vec3;


const RANGE_GOAL=1
async function attack(entity,bot){
    bot.loadPlugin(pathfinder)
    if(entity){
        await bot.lookAt(entity.position)
        const mcData = require('minecraft-data')(bot.version)
        const defaultMove = new Movements(bot, mcData)
        bot.loadPlugin(pathfinder)
        bot.pathfinder.setMovements(defaultMove)
        await bot.pathfinder.setGoal(new GoalNear(entity.position.x, entity.position.y, entity.position.z, RANGE_GOAL))
        await bot.lookAt(entity.position)
        bot.attack(entity)
    }else{console.log("There's no entity near me.")}

}


module.exports=attack