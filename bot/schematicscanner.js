const { Schematic } = require("prismarine-schematic")
const Vec3 = require('vec3').Vec3;
const { goals: { GoalNear } } = require('mineflayer-pathfinder')
const fs = require('fs').promises
const path = require('path')

  class blocc {
    constructor(name, face, difference) {
      this.name = name;
      this.face=face
      this.difference = difference;
    }
  }
  
async function call(bot,name){
    const filter = e => e.type === 'player'
        var schematic= await Schematic.read(await fs.readFile(path.resolve("./schematics/"+name+".schem")), bot.version)
        const Block = require('prismarine-block')(schematic.version)
        cica=[]
        blknum=0
        var i=0
        var alma;
        var facing;
        savee=[]
        for(var y=0;y<schematic.size.y;y++){
            for(var z=0;z<schematic.size.z;z++){
                for(var x=0;x<schematic.size.x;x++){
                  for (const stateId of schematic.palette) {
                    if(schematic.blocks[i]==blknum){
                      alma=Block.fromStateId(stateId, 0)
                      facing=alma.getProperties()
                      break;
                    }
                    blknum+=1
                  }
                    savee.push(new blocc(alma,facing,new Vec3(x,y,z)))
                    i+=1
                    blknum=0
                }
            }
        }
        console.log(savee)
        return savee
}
module.exports=call