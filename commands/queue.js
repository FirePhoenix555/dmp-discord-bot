const Discord = require('discord.js');
const { validUsers } = require('../config.json');
const fs = require('fs').promises;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('queue')
        .setDescription('Queues a DMP to be posted on a specified date.')
        .addStringOption(option =>
            option.setName('date')
                .setDescription('The date of the DMP in "YYYY-MM-DD" format.')
                .setRequired(true)
                .setMaxLength(10)
                .setMinLength(10))
        .addStringOption(option =>
            option.setName('answer')
                .setDescription('The answer of the DMP.')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('attachments')
                .setDescription('Any images to send with the DMP.'))
        .addStringOption(option =>
            option.setName('content')
                .setDescription('The content to send with the DMP.')),
    async execute(interaction) {
        // checking if the user is allowed to use this command (whitelist)
        if (!validUsers.includes(interaction.user.id)) {
            return 1;
        }

        let date;
        if (interaction.options.get("date")) {
            date = interaction.options.get("date").value;

            if (!/\d\d\d\d-\d\d-\d\d/.test(date)) {
                return 6;
            }
        } else {
            console.log("Invalid date.");
            return 7;
        }

        let content = "";
        if (interaction.options.get("content")) content = interaction.options.get("content").value;

        let attachments = [];
        if (interaction.options.get("attachments")) attachments.push(interaction.options.get("attachments"));

        let answer = interaction.options.get("answer").value;

        let d = new Date(date + "T12:00:00.000-06:00"); // to post at noon CST / 1pm CDT
        let timestamp = d.valueOf();
        
        let data = {
            "message": {
                content,
                attachments
            },
            answer,
            timestamp
        }

        let archive = require('../archives.json');
        if (archive[date]) return 10;

        let queue = require('../queue.json');
        queue[date] = data;

        await fs.writeFile('./queue.json', JSON.stringify(queue));

        require('../schedule-dmp.js')(interaction.client, queue, date);

        await interaction.reply("Successfully queued DMP.");

        return 0;
    },
};