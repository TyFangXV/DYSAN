require("dotenv").config();

const fs = require("fs");
const path = require("path");
//let card = new discord.MessageEmbed();
module.exports = {
  name: path.basename(__filename).split(".")[0],
  async execute(message, discord, args) {
    //commands folder
    let folders = fs.readdirSync(path.join(`${__dirname} ../../`));
    
    //if param is empty it returns the category 
    if (args == "") {
      let card = new discord.MessageEmbed();

      card
        .setTitle("NWB help center")
        .setColor("#fa078d")
        .setDescription("**Find the command you want by entering the category.**")
        .setFooter("@NWB");
      
      folders.forEach((dir) => {
        if (dir !== "help") {
          card.addField(dir, `${process.env.PREFIX} help ${dir}`, true);
        }
      });

      await message.channel.send(card);
    }

    folders.forEach((dir) => {
      if (args == dir) {
        let folders = fs.readdirSync(path.join(`${__dirname} ../../${dir}`));
        let card = new discord.MessageEmbed();

        card
          .setTitle("NWB help center")
          .setColor("#fa078d")
          .setDescription("-----------*Enjoy*-----------")
          .setFooter("NWB");

        folders.forEach((command) => {
          card.addField(
            command.split(".")[0],
            `${process.env.PREFIX} ${command.split(".")[0]}`,
            true
          );
        });

        message.channel.send(card);
      } else {
        return;
      }
    });
  },
};
