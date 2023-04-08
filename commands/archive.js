const Discord = require('discord.js');
const { channelId } = require('../config.json');
const fs = require('fs').promises;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('archive')
        .setDescription('Archives a single DMP to the database.')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The message to archive.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('date')
                .setDescription('The date of the DMP in "YYYY-MM-DD" format. Set to the date of submission if not included.')),
    async execute(interaction) {
        const channel = interaction.client.channels.cache.get(channelId);
        const msgId = interaction.options.get("message_id").value;

        channel.messages.fetch(msgId)
        .then(async message => {
            // getting attachments
            let att = [];
            message.attachments.forEach(attachment => {
                att.push(attachment.url);
            });

            let date;
            if (interaction.options.get("date")) date = interaction.options.get("date").value;
            else date = formatTimestamp(message.createdTimestamp);

            let data = {
                "url": message.url,
                "channelId": message.channelId,
                "id": message.id,
                "content": message.content,
                "embeds": message.embeds,
                "attachments": att
            };

            let archive = require('../archives.json');
            archive[date] = data;

            await fs.writeFile('./archives.json', JSON.stringify(archive));

            await interaction.reply("Successfully archived.");
        }).catch(console.error);
    },
};

function formatTimestamp(timestamp) {
    let date = new Date(timestamp);
    let day = date.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2});
    let month = (date.getMonth() + 1).toLocaleString(undefined, {minimumIntegerDigits: 2});
    let year = date.getFullYear().toLocaleString(undefined, {minimumIntegerDigits: 4}).replace(",", "");

    return year + "-" + month + "-" + day;
}