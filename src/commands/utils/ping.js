const path = require("path");

module.exports = {
  name: path.basename(__filename).split(".")[0],
  status : "dep",
  async execute(message, discord) {
      // It sends the user "Pinging"
      message.channel.send("Pinging...").then(m =>{
        // The math thingy to calculate the user's ping
          var ping = m.createdTimestamp - message.createdTimestamp;

        // Basic embed
          var embed = new discord.MessageEmbed()
          .setAuthor(`Your ping is ${ping}ms.`)
          .setColor("#424242")
          
          // Then It Edits the message with the ping variable embed that you created
          m.edit(embed)
      });
  },
};
