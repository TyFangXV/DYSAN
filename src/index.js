require("dotenv").config();
const discord = require("discord.js");
const fs = require("fs");
const path = require("path")
const mongoose = require("mongoose");
const moment = require("moment")
const registery = require("./utils/model/account")
const news = require('./utils/functions/news')
const prefix = process.env.PREFIX || "$";



const client = new discord.Client();
client.command = new discord.Collection();

const coolDown = 5 * 1000;
const messagedRecently = new Set();

const sendRecently = new Set();

//#region database connection 
mongoose.connect(process.env.DB, {useNewUrlParser : true, useUnifiedTopology : true, bufferCommands : false, useCreateIndex : false, useFindAndModify: false})
           .then(res => console.log("connected"))
           .catch(err => console.log(err))
           //#endregion
           
           //#region  bot-command-initialization 
           
           const folders = fs.readdirSync("./src/commands")
           
           folders.forEach(async(folder) => {
              //searches for file that end with .js
              const commandFiles =  fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"));
              
              //sets every file that end with .js as a command
              
              for (const file of commandFiles) 
              {
                 const command = require(`./commands/${folder}/${file}`);
                 client.command.set(command.name, command, command.status);
               }
               
            });
            //#endregion
            
            
            //#region  discord-bot
            
            //#region discord-bot start
            
client.on("ready", async() => {
   client.user.setActivity(" : '$ help'", { type: "WATCHING" });
   console.log("bot online");
   console.log(`current time ${moment.tz(moment(), 'Asia/Dubai').format('h:mma').toLowerCase()}`);
               client.guilds.cache.forEach((guild) => {
                  console.log(`${guild.name} | ${guild.id}`);
               });
               
//#region timed message
setTimeout(() => {
   //checks if the registery isnt empty
 const serverRegisteries = await registery.find();
 if(serverRegisteries.length !== 0)
   {
      //save the data locally in a json file
      if(!fs.existsSync("./data.json"))
      {
         console.log("file made")
         serverRegisteries.forEach(data => {
            fs.writeFileSync("./data.json", JSON.stringify(data))
         });         
      }

      //if the data is saved locally 
      if(fs.existsSync('./data.json'))
         {
            //checks every 3 sec whether if its time to send the message 
            //if it is then add the server id to the set so that it wont be send multiple times
            setInterval(async()=>{
               const currentTime = moment.tz(moment(), 'Asia/Dubai').format('h:mma').toLowerCase();
               let timing = JSON.parse(fs.readFileSync("./data.json"));
               if(timing.time.toLowerCase() == currentTime && !sendRecently.has(timing._id))
                 {
                    console.log("running")
                    await news(discord, client,timing.channelId )
                    sendRecently.add(timing._id)
                 }
                 
               }, 5000)
               
               //clear the set after a min   
               setTimeout(() => {
                  let timing = JSON.parse(fs.readFileSync("./data.json"));
                  if(sendRecently.has(timing._id))
                    {
                        sendRecently.delete(timing._id)
                        console.log("removed")                       
                    }

               }, 60000);
               
               

         }
   }   
}, 10000);



//#endregion

});

//#endregion


//#region discord-command-handler
client.on("message", (message) => {
 
   //return null if the user is a bot or doesnt start with the prefix
   if (message.author.bot) return null;

   if (message.content.startsWith(prefix)) 
   {

      //trim the prefix out of the message to get the command and then convert any uppercase letter to lowercase
      const command = message.content.slice(prefix.length).trim(" ").toLowerCase().split(" ")[0];
      const args = message.content.slice(prefix.length).trim(" ").toLowerCase().slice(command.length).trim(" ").split(" ");

      let skip = false;
      const folders = fs.readdirSync("./src/commands");

         folders.forEach(async(folder) => {
               //loops through the folder and get all the files that end with js
               const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"));
               //loops through all the files and if the name of the file matches the command then execute that command
               if (!skip) {
                     for (const file of commandFiles)    
                     {
                        if (file.split(".")[0] == command) 
                        {
                           try {               
                            //if the command is not in development then it will send the command result       
                            if(client.command.get(command).status !== "dev")   
                             {

                            if (messagedRecently.has(message.author.id)) 
                            {
                               let card = new discord.MessageEmbed;
                                 card
                                   .setColor("#fa078d")
                                   .setTitle(`**cooldown ${coolDown / 1000}s**`)
                                   .setDescription("ayo, hold up")
                               message.channel.send(card);
                            } else 
                            {
                              client.command.get(command).execute(message, discord, args, client);
                                // Adds the user to the set so that they can't talk for a minute
                                messagedRecently.add(message.author.id);      

                                // Removes the user from the set after a minute
                                setTimeout(() => {
                                  messagedRecently.delete(message.author.id);
                                }, coolDown);
                            }
                             }else
                             {
                                message.channel.send("The command is still under development")
                                skip = true;
                             }
                           } catch (error) {
                              message.channel.send(`error at ${file.split(".")[0]}: ${error.message}`);
                              skip = true;
                           }
                        }
                     }

               } else 
               {
                  return;
               }
         });

      skip = false;
   }
});
 //#endregion



//update the data.json file every 3 hours
 setInterval(() => {
   const serverRegisteries = registery.find()
   serverRegisteries.forEach(data => {
      fs.writeFileSync("./data.json", JSON.stringify(data))
   });  
 }, 1000 * 60 * 60 * 3);




 client.login(process.env.TOKEN);
//#endregion