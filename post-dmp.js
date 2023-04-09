const { channelId, roleId } = require('./config.json');
const fs = require('fs').promises;

module.exports = async function postDMP(client, dmp, date, queue) {
    console.log("Posting DMP for " + date);

    // post
    const channel = client.channels.cache.get(channelId);

    let url = "";
    if (dmp.message.attachments[0]) url = dmp.message.attachments[0].attachment.url;

    const embed = {
        // color: 0x0099ff,
        title: 'DMP for ' + date,
        description: dmp.message.content,
        image: {
            url,
        }
    };
    
    let message = await channel.send({ content: `<@&${roleId}>`, embeds: [embed] });

    // add to archive
    const archive = require("./archives.json");
    let data = {
        "url": message.url,
        "channelId": message.channelId,
        "id": message.id,
        "content": dmp.message.content,
        "embeds": message.embeds,
        "attachments": dmp.message.attachments,
        "answer": dmp.answer,
        "timestamp": message.createdTimestamp
    };

    archive[date] = data;
    await fs.writeFile('./archives.json', JSON.stringify(archive));

    // remove from queue
    delete queue[date];
    await fs.writeFile('./queue.json', JSON.stringify(queue));

    console.log("DMP posted.");
}