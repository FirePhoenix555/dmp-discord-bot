const Discord = require('discord.js');
const { channelId, validUsers } = require('../config.json');
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
                .setDescription('The date of the DMP in "YYYY-MM-DD" format. Set to the date of submission if not included.')
                .setMaxLength(10)
                .setMinLength(10))
        .addStringOption(option =>
            option.setName('answer')
                .setDescription('[LEGACY] The DMP\'s answer. Only set for past DMPs.'))
        ,
    async execute(interaction) {
        // checking if the user is allowed to use this command (whitelist)
        if (!validUsers.includes(interaction.user.id)) {
            await interaction.reply({ content: "Sorry, you are not authorized to use this command.", ephemeral: true });
            return;
        }

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
            if (interaction.options.get("date")) {
                date = interaction.options.get("date").value;
                if (!/\d\d\d\d-\d\d-\d\d/.test(date)) {
                    await interaction.reply({ content: "Invalid date format.", ephemeral: true });
                    return;
                }
            }
            else date = formatTimestamp(message.createdTimestamp);

            let answer = "PLACEHOLDER";
            if (interaction.options.get("answer")) answer = interaction.options.get("answer").value;

            let data = {
                "url": message.url,
                "channelId": message.channelId,
                "id": message.id,
                "content": message.content,
                "embeds": message.embeds,
                "attachments": att,
                "answer": answer,
                "timestamp": message.createdTimestamp
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
    let day = date.getDate().toLocaleString('en-US', { timeZone: 'America/Chicago', minimumIntegerDigits: 2 });
    let month = (date.getMonth() + 1).toLocaleString('en-US', { timeZone: 'America/Chicago', minimumIntegerDigits: 2 });
    let year = date.getFullYear().toLocaleString('en-US', { timeZone: 'America/Chicago', minimumIntegerDigits: 4 }).replace(",", "");

    return year + "-" + month + "-" + day;
}