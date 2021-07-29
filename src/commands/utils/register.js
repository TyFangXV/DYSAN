const path = require("path");
const moment = require("moment-timezone");
const registery = require("../../model/account");

module.exports = {
  name: path.basename(__filename).split(".")[0],
  status: "dep",
  async execute(message, discord, args) {
    //function to check if the timezone is valid
    const isValidTimezone = (timezone) => {
      return moment.tz.zone(timezone) != null;
    };
    //check if the user is admin
    if (message.author.id !== message.guild.members.guild.ownerID)
      message.channel.send(`Only the admin can access this command 👮‍♂️`);

    //if param is not detected
    if (args[0] == "") 
    {
      message.channel.send(
        `go to https://momentjs.com/timezone to get the timezone of your country 🎉`
      );
    }


    //if param is detected
    if (args[0] !== "") 
    {
      //checks if the server is already registered 
      const preMadeServerData = await registery.findById(message.guild.id);
      if(preMadeServerData !== null) message.channel.send("Your already logged in 👮‍♂️");
      if(preMadeServerData == null)
      {
        //if a channel has been mentioned in the message
        if(message.mentions.channels.first())
        {
            //checks if timezone is valid
            if (isValidTimezone(args[0]) ) 
            {
              //registers the server to the db
              const newServer = new registery({
                _id : message.guild.id,
                name : message.guild.name,
                time_zone : args[0],
                channelId : message.mentions.channels.first().id,
              }) 
              
              newServer.save()
              message.channel.send("Sever registered 😎")
            }else {
              message.channel.send("Invalid timezone ❌")          
            }
        }else{
          message.channel.send("A channel is not mentioned ❌")
        }
      }
    }
  },
};
