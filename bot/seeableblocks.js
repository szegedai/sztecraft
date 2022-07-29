const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const Vec3 = require('vec3').Vec3;


async function todo (bot,itemname) {
    bot.loadPlugin(pathfinder)
    var koordinata=bot.entity.position
    var jelenlegi={
      x:koordinata.x,
      y:koordinata.y,
      z:koordinata.z
    }
      const x1 = jelenlegi.x
      const y1 = jelenlegi.y
      const z1 = jelenlegi.z
      jelenlegi.y
      var tmp=0
      var targets=[]
      for(var x=-30;x<=30;x++){
        jelenlegi.x = x1
        jelenlegi.x +=x
          for(var y=-30;y<=30;y++) {
            jelenlegi.y=y1
            jelenlegi.y +=y
              for(var z=-30;z<=30;z++) {
                  jelenlegi.z =z1
                  jelenlegi.z +=z
                  var block=bot.blockAt(new Vec3(jelenlegi.x,jelenlegi.y,jelenlegi.z))
                if(block.name == (itemname)){
                  if(bot.canSeeBlock(block)){
                    tmp+=1
                    targets.push(block)
                  }
                }
            }
        }
    }
    if(tmp==0){return null}else{
      return targets}
}
module.exports=todo
