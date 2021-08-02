const Guardian = require('guardian-js').default;
const guardian = new Guardian(process.env.NEWS_TOKEN, false);
const {MessageEmbed} = require("discord.js");

let newsCategory = process.env.TYPE.split(",")
let currentIndex = 0;


const sendMessage = async(post,group)=>{
   await group.send(`${post.webTitle}\n ${post.webUrl}`)
}

const getNews = async(tags,discord, client, channelID)=>{
        try {
          const resp = await JSON.parse(await JSON.stringify(await guardian.tags.search(tags)));
          const news = JSON.parse(resp.response.body)
          news.response.results.forEach(async(post) => {
                const group = client.channels.cache.find(channel => channel.id == channelID)
                await sendMessage(post, group)   
          })                
        } catch (error) {
         console.log(error.message)
        }        
}



const getTodayNews = async(discord, client, channelID)=>{
   await getNews(newsCategory[currentIndex],discord, client, channelID)
   currentIndex++;
   console.log(`index : ${currentIndex}`)
   setTimeout(async() => {
    if(currentIndex < newsCategory.length)
      {
          console.log("running")
         await getTodayNews(discord, client, channelID)                  
      }     
   }, 2000);
}




module.exports = getTodayNews;