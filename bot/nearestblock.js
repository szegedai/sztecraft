const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const Vec3 = require('vec3').Vec3;
var seeableblocks=require('./seeableblocks.js');

async function todo (bot,itemname) {
    var blocks=[]
    blocks= await seeableblocks(bot,itemname)
    var seged=0
    var min=0
    if(blocks){
    blocks.forEach((element, index, array) => {
        if(seged==0){
          seged+=1
            min=element;
        }else{if(distance(min,element,bot)){}else{min=element}}
    });
    return min}else{return null}
  }

    function distance(a, b, bot) {
      var kezdo=bot.entity.position
      let dx = Math.abs(kezdo.x - a.position.x);
      let dy = Math.abs(kezdo.y -  a.position.y);
      let dz=  Math.abs(kezdo.z -  a.position.z);
      let cx = Math.abs(kezdo.x -  b.position.x);
      let cy = Math.abs(kezdo.y -  b.position.y);
      let cz= Math.abs(kezdo.z -  b.position.z);
      aeuk=Math.sqrt(dx * dx + dy * dy + dz* dz)
      beuk=Math.sqrt(cx * cx + cy * cy + cz* cz)
      if(aeuk>beuk){
        return false
      }else{
        return true
      }
      }
      module.exports=todo
  