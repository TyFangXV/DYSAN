const path = require("path");
const moment = require("moment-timezone");
const registery = require("../../utils/model/account");
let current = '12am'
const isValidTimezone = (timezone) => {
  return moment.tz.zone(timezone) != null;
};

const isValidTime = (input)=>{
  const regex = /^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm|AM|PM)$/;
  return input.match(regex) !== null ? true : false 
}

module.exports = {
  name: path.basename(__filename).split(".")[0],
  status: "dep",
  async execute(message, discord, args, client) {
    //function to check if the timezone is valid
    //check if the user is admin
    if (message.author.id !== message.guild.members.guild.ownerID) message.channel.send(`Only the admin can access this command 👮‍♂️`);

    //if param is not detected
    if (args[0] == "") 
    {
      message.channel.send(
        '```' + `$ ${path.basename(__filename).split(".")[0]} <timezone> <channel> <Time(12-hour clock timing)>`+ '```' +`\ngo to https://momentjs.com/timezone to get the timezone of your country 🎉`
      );
    }


    //if param is detected
    if (args[0] !== "") 
    {
      //checks if the server is already registered 
      const preMadeServerData = await registery.findById(message.guild.id);
      if(preMadeServerData !== null) message.channel.send("Your already logged in 👮‍♂️");
      
      //checks if the correct parameters are there and is valid
      if(preMadeServerData == null)
      {
        //if a channel has been mentioned in the message
        if(message.mentions.channels.first())
        {
            //checks if timezone is valid
            if (isValidTimezone(args[0])) 
            {
              if(isValidTime(args[2]))
               {
                 try {
                    //registers the server to the db
                    const newServer = new registery({
                      _id : message.guild.id,
                      name : message.guild.name,
                      time_zone : args[0],
                      channelId : message.mentions.channels.first().id,
                      time : args[2]
                    }) 
                    
                    newServer.save()
                    message.channel.send("Sever registered 😎")  
                    const group = client.channels.cache.find(channel => channel.id == message.mentions.channels.first().id)
                    group.send("@everyone```*Mute this channel to avoid spam notification*```\n Don't tell i didn't warn you")                     
                 } catch (error) {
                    message.channe.send(`500 error : ${error.message}`)
                 } 
               
               }else{
                  message.channel.send("Invalid time❌")                  
               }

            }else {
              message.channel.send("Invalid timezone ❌")          
            }
        }else{
          message.channel.send("A channel is not mentioned ❌")
        }
      }
    }
  }
 }

