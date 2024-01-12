const Discord = require('discord.js');
const { channelId, validUsers } = require('../json/config.json');
const { formatTimestamp } = require('../util/date.js');
const { archiveFromMessage } = require('../util/messages');
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
        .addStringOption(option =>
            option.setName('override')
                .setDescription('Set this to anything if you want to override the date given. Removes warning on date overlap.'))
        ,
    async execute(interaction) {
        // checking if the user is allowed to use this command (whitelist)
        if (!validUsers.includes(interaction.user.id)) {
            return 1;
        }

        const channel = interaction.client.channels.cache.get(channelId);
        const msgId = interaction.options.get("message_id").value;

        channel.messages.fetch(msgId)
        .then(async message => {
            let date;
            if (interaction.options.get("date")) {
                date = interaction.options.get("date").value;
                if (!/\d\d\d\d-\d\d-\d\d/.test(date)) {
                    return 6;
                }
            }
            else date = formatTimestamp(message.createdTimestamp);

            let answer = "PLACEHOLDER";
            if (interaction.options.get("answer")) answer = interaction.options.get("answer").value;

            let data = archiveFromMessage(message, answer);

            let archive = require('../json/archives.json');

            if (archive[date] && !interaction.options.get("override")) return 10;

            archive[date] = data;

            await fs.writeFile('./json/archives.json', JSON.stringify(archive));

            await interaction.followUp("Successfully archived.");
        }).catch(console.error);

        return 0;
    },
};