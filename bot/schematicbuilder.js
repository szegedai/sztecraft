const { Schematic } = require("prismarine-schematic")
const Vec3 = require('vec3').Vec3;
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const fs = require('fs').promises
const path = require('path')
const facingData = require('./specialblocks.json')

function wait (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }


var half;
async function build(bot,blokkok,hova){
for(var i=0;i<blokkok.length;i++){
    console.log("belefut")
    half="bottom"
    tx=parseInt(blokkok[i].difference.x)
    ty=parseInt(blokkok[i].difference.y)
    tz=parseInt(blokkok[i].difference.z)
    pos=new Vec3(hova.x+tx,hova.y+ty+1,hova.z+tz)
    bot.lookAt(pos)
    if(blokkok[i].name.displayName=='Air'){}else{
        if(bot.blockAt(pos).displayName==blokkok[i].name.displayName){
        }else{
    if(isspecial(blokkok[i].face,null,bot)){
        blockchange(bot,blokkok[i].name)
        vektor=facecheck(blokkok[i].face,blokkok[i].name.name)
        var cat=blokkok[i].name.displayName
        if(cat.includes("Log")){
            await bot.creative.flyTo(new Vec3(pos.x,pos.y+3,pos.z))
            await wait(500)
        }
        await merre(vektor,pos,bot)
        await wait(1000)
        if(bot.blockAt(new Vec3(pos.x,pos.y,pos.z)).displayName=='Air'){}else{
            await bot.dig(bot.blockAt(new Vec3(pos.x,pos.y,pos.z)),false)
        }
        await bot.lookAt(pos)
        await wait(500)
        await bot._genericPlace(bot.blockAt(new Vec3(pos.x,pos.y,pos.z)), vektor, { half, delta:0 })
    }else{
    await bot.creative.flyTo(new Vec3(pos.x,pos.y+2,pos.z))
    blockchange(bot,blokkok[i].name)
    await wait(100)
        if(bot.blockAt(new Vec3(pos.x,pos.y,pos.z)).displayName=='Air'){}else{
            await bot.dig(bot.blockAt(new Vec3(pos.x,pos.y,pos.z)),false)
        }
        await wait(500)
        await isthere(pos,false,bot,null)
    }
    }
    }
}
}
async function merre(vec,pos,bot){
    if(vec.x!=0){
        await bot.creative.flyTo(new Vec3(pos.x+(vec.x*2),pos.y+3,pos.z))
    }
    if(vec.y!=0){}
    if(vec.z!=0){
        await bot.creative.flyTo(new Vec3(pos.x,pos.y+3,pos.z+(vec.z*2)))
    }
}
function facecheck(facing,blok){
    if(facing.axis!=null){
        switch (facing.axis) {
            case 'y':
              return new Vec3(0,1,0);
            case 'x':
                return new Vec3(1,0,0)
            case 'z':
                return new Vec3(0,0,1)
      }
    }
    if(facing.facing!=null){
        if(facing.facing.west!=null&&facing.facing.west!=null&&facing.facing.west!=null&&facing.facing.west!=null){
        }else{
        half=facing.half
        isinvert=1
        const data = facingData[blok]
        if(data.inverted){
            isinvert=-1
        }
        switch (facing.facing) {
            case 'east':
              return new Vec3(1*isinvert,0,0)
            case 'north':
                return  new Vec3(0,0,-1*isinvert)
            case 'south':
                return new Vec3(0,0,1*isinvert)
            case 'west':
                return new Vec3(-1*isinvert,0,0)
      }
    }
    }
    return new Vec3(0,1,0);
}
function isspecial(facing,blokk,bot){
    if(blokk==null){
    if(facing.axis!=null){
        return true
    }
    if(facing.facing!=null){
        return true
    }
   /* if(facing.east!=none || facing.north!=none || facing.south!=none || facing.up!=none || facing.west!=none){
        return true
    }*/
        return false
    }else{
        const Block = require('prismarine-block')(bot.version)
        alma=Block.fromStateId(blokk.stateId, 0)
        facing=alma.getProperties()
        if(facing.facing==null){
            return false
        }else{
            return true}
    }   
}

async function isthere(pos,special,bot,facev){
if(special){

}else{
    if(bot.blockAt(new Vec3(pos.x,pos.y-1,pos.z)).displayName!="Air" && isspecial(null,bot.blockAt(new Vec3(pos.x,pos.y-1,pos.z)),bot)==false){
        await bot.placeBlock(bot.blockAt(new Vec3(pos.x,pos.y-1,pos.z)),new Vec3(0,1,0))
    }
    else if(bot.blockAt(new Vec3(pos.x,pos.y+1,pos.z)).displayName!="Air" && isspecial(null,bot.blockAt(new Vec3(pos.x,pos.y+1,pos.z)),bot)==false){
        await bot.placeBlock(bot.blockAt(new Vec3(pos.x,pos.y+1,pos.z)),new Vec3(0,-1,0))
    }
    else if(bot.blockAt(new Vec3(pos.x,pos.y,pos.z-1)).displayName!="Air" && isspecial(null,bot.blockAt(new Vec3(pos.x,pos.y,pos.z-1)),bot)==false){
        await bot.placeBlock(bot.blockAt(new Vec3(pos.x,pos.y,pos.z-1)),new Vec3(0,0,1))
    }
    else if(bot.blockAt(new Vec3(pos.x,pos.y,pos.z+1)).displayName!="Air" && isspecial(null,bot.blockAt(new Vec3(pos.x,pos.y,pos.z+1)),bot)==false){
        await bot.placeBlock(bot.blockAt(new Vec3(pos.x,pos.y,pos.z+1)),new Vec3(0,0,-1))
    }
    else if(bot.blockAt(new Vec3(pos.x-1,pos.y,pos.z)).displayName!="Air" && isspecial(null,bot.blockAt(new Vec3(pos.x-1,pos.y,pos.z)),bot)==false){
        await bot.placeBlock(bot.blockAt(new Vec3(pos.x-1,pos.y,pos.z)),new Vec3(1,0,0))
    }
    else if(bot.blockAt(new Vec3(pos.x+1,pos.y,pos.z)).displayName!="Air" && isspecial(null,bot.blockAt(new Vec3(pos.x+1,pos.y,pos.z)),bot)==false){
        await bot.placeBlock(bot.blockAt(new Vec3(pos.x+1,pos.y,pos.z)),new Vec3(-1,0,0))
    }else{
        await bot._genericPlace(bot.blockAt(new Vec3(pos.x,pos.y,pos.z)), new Vec3(0,1,0), { half, delta:0 })
    }
}
}
async function blockchange(bot,block){
const mcData = require('minecraft-data')(bot.version)
const Item = require('prismarine-item')(bot.version)
if(block.displayName=='Air'){}else{
items = mcData.itemsByName[block.name]
 if(bot.heldItem==null || bot.heldItem.displayName==block.displayName){
    if (!bot.inventory.items().find(x => x.type === items.id)) {
        const slot = bot.inventory.firstEmptyInventorySlot()
        await bot.creative.setInventorySlot(36, new Item(items.id, 1))
      }
      const item = bot.inventory.items().find(x => x.type === items.id)
      await bot.equip(item, 'hand')
 }else{
    if (bot.inventory.items().length > 30) {
      bot.chat('/clear')
      await wait(1000)
    }
    if (!bot.inventory.items().find(x => x.type === items.id)) {
      const slot = bot.inventory.firstEmptyInventorySlot()
      await bot.creative.setInventorySlot(36, new Item(items.id, 1))
    }
    const item = bot.inventory.items().find(x => x.type === items.id)
    await bot.equip(item, 'hand')
}
}
}
module.exports=build