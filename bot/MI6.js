const mineflayer = require('mineflayer');
const Vec3 = require('vec3').Vec3;
var schematicscanner=require('./schematicscanner')
var schematicbuilder=require('./schematicbuilder.js')
const axios = require('axios');
const nearblock=require('./nearestblock')
const move=require('./move')
const destroy=require('./break')
const dance=require('./dance')
const uuid = require('uuid');


function wait (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

//Bot in progress
const options = {
    host: 'localhost',
    username: 'MI6',
    port:'52188',
    ids:uuid.v4()
  }
  const bot = mineflayer.createBot(options)
//Plugins

//Listeners
  bot.on('spawn',()=>{
    bot.chatAddPattern(/^(?:\[[^\]]*\] )?([^ :]*) ?: (.*)$/, 'whisper', 'Some description')
    bot.chat("I'm "+bot.username+", look at me!")
  })


  bot.on('whisper', async (username, message, type, rawMessage, matches) => {
    if (username === bot.username) return
    console.log('Chat received!')
    console.log(`Username: ${username}`)
    console.log(`Message: ${message}`)
    console.log(type)
    console.log(bot.ids)
    if(message.includes("teszt")){
      const filter = e => e.type === 'player'
      var entity=bot.nearestEntity(filter)
      destination=bot.blockAtEntityCursor(entity, maxDistance=256)
      console.log(destination)
    }
    if(type.includes("incoming")){
      apicall(message,bot.ids)
    }else{}

  })


  function apiresponse(status){
    axios
    .get('http://127.0.0.1:5000/status/'+ status)
    .then(async res =>{console.log(res.data);
      for (let [key, value] of Object.entries(res.data)) {
        bot.chat(value["message"])
      }
    })
  }

 function apicall(chat,id) {
    axios
    .get('http://127.0.0.1:5000/'+ id+'/'+chat)
    .then(async res =>{
      console.log(res.data);
      for (let [key, value] of Object.entries(res.data)) {
        var destination;
        const filter = e => e.type === 'player'
        var entity=bot.nearestEntity(filter)
        if(value["command_type"]=="ask"){
          bot.chat(value["message"])
        }else{
        bot.chat(value["message"])
        switch (value["location"]){
          case "there":
            destination=bot.blockAtEntityCursor(entity, maxDistance=256)
            break;
          case "here":
            for(var y=entity.position.y;y>=-100000;y--){
              if(bot.blockAt(new Vec3(entity.position.x,y,entity.position.z)).displayName=="Air"){}else{
              destination=bot.blockAt(new Vec3(entity.position.x,y+1,entity.position.z))
                break;}}
            break;
          default:
            for(var y=entity.position.y;y>=-100000;y--){
              if(bot.blockAt(new Vec3(bot.entity.position.x,y,bot.entity.position.z)).displayName=="Air"){}else{
              destination=bot.blockAt(new Vec3(bot.entity.position.x,y-1,bot.entity.position.z))
                break;}}
          }
        if(value["command_type"]=="build"){
            try{
                bot.chat('/gamemode creative')
                if(value["structure"]=="house"){
                var blokkok;
                console.log(value["structure"])
                blokkok=await schematicscanner(bot,value["structure"])
                await schematicbuilder(bot,blokkok,destination.position)
                apiresponse("200")
                await bot.creative.flyTo(destination.position)
                bot.chat("/gamemode survival")
          }
            }
            catch{
              apiresponse("400")
            }
        }
        if(value["command_type"]=="get"){
          try{
            const mcData = require('minecraft-data')(bot.version)
            till=parseInt(value["quantity"])
            item=mcData.itemsByName[value["item"]]
            var mennyi=bot.inventory.count(item.id)
            var meddig=mennyi
            meddig+=till
            while(bot.inventory.count(item.id)<meddig){
              var block=await nearblock(bot,value["item"])
              if(block){
                if(block.material.includes("pickaxe")){
                  bot.chat("Sorry i can't get u that kind of item at this phase of dev.")
                  break;
                }
              console.log("destroy"+block)
              await move(block.position,bot)
              await destroy(bot,block)}else{bot.chat("i cant find "+value["item"]+" here.");break}
            }
            apiresponse(200)
          }catch{apiresponse(400)}
          }
      }
        if(value["command_type"]=="move"){
          try{
            await move(destination.location,bot)
            apiresponse(200)
          }catch{apiresponse(400)}
        }
        if(value["command_type"]=="destroy"){
          if(value["location"]=="that"){
            const filter = e => e.type === 'player'
            var entity=bot.nearestEntity(filter)
            var oda=bot.blockAtEntityCursor(entity, maxDistance=256)
            destroy(bot,oda)
          }
        }
        if(value["command_type"]=="dance"){
          try{
            await dance(bot)
            apiresponse(200)
          }catch{apiresponse(400)}
        }
      }
    })
    .catch(error => {
      console.error(error);
    }); 
  }
  
  bot.on("rain",()=>{
    bot.chat("/weather clear")
  })
  bot.on("physicTick",()=>{
    if(!bot.time.isDay) bot.chat("/time set day")
  })