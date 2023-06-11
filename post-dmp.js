const Discord = require('discord.js');

const { channelId, roleId } = require('./json/config.json');
const fs = require('fs').promises;

module.exports = async function postDMP(client, dmp, date, queue) {
    console.log("Posting DMP for " + date);

    // post
    const channel = client.channels.cache.get(channelId);

    let url = "";
    let files = [];

    const embed = new Discord.EmbedBuilder()
        //.setColor(0x0099FF)
        .setTitle('DMP for ' + date);
    
    if (dmp.message.attachments[0]) {
        url = dmp.message.attachments[0];
        embed.setImage('attachment://' + date + '.png');
        files = ['./imgs/' + date + '.png'];
    }

    if (dmp.message.content) embed.setDescription(dmp.message.content);

    let message = await channel.send({ content: `<@&${roleId}>`, embeds: [embed], files });

    // add to archive
    const archive = require("./json/archives.json");
    let data = {
        "url": message.url,
        "channelId": message.channelId,
        "id": message.id,
        "content": dmp.message.content,
        "embeds": message.embeds,
        "attachments": message.attachments,
        "answer": dmp.answer,
        "timestamp": message.createdTimestamp
    };

    archive[date] = data;
    await fs.writeFile('./json/archives.json', JSON.stringify(archive));

    // remove from queue
    delete queue[date];
    await fs.writeFile('./json/queue.json', JSON.stringify(queue));

    console.log("DMP posted.");
}