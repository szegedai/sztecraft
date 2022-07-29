const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const Vec3 = require('vec3').Vec3;

function wait (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
function distance(hol,hova){
    x=Math.abs(hol.x-hova.x)
    y=Math.abs(hol.y-hova.y)
    z=Math.abs(hol.z-hova.z)
    c=(x+y+z)/5.5
    return (c)
}


const RANGE_GOAL = 1
async function move(location, bot){
    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)
    bot.loadPlugin(pathfinder)
    bot.pathfinder.setMovements(defaultMove)
    bot.pathfinder.setGoal(new GoalNear(location.x, location.y, location.z, RANGE_GOAL))
    ds=distance(bot.entity.position,location)
    await wait(1000*ds)
}

module.exports=move