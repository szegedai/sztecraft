var move=require('./move.js');
const Vec3 = require('vec3').Vec3;

function wait (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

async function dance(bot){
    for(var i=0;i<10;i++){
    await bot.setControlState('jump',true)
    var random=Math.floor(Math.random() * 100)-100
    await bot.lookAt(new Vec3(bot.entity.position.x+random,bot.entity.position.y+random,bot.entity.position.z))
    var random=Math.floor(Math.random() * 100)+0
    await bot.lookAt(new Vec3(bot.entity.position.x+random,bot.entity.position.y+random,bot.entity.position.z))
    await bot.swingArm('left')
    wait(1000)
    }
   bot.setControlState('jump',false)

    
}


module.exports=dance