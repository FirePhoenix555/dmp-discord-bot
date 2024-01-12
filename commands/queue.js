const Discord = require('discord.js');
const { validUsers } = require('../json/config.json');
const fs = require('fs').promises;
const downloadImage = require('../util/download-image.js');

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
                .setDescription('The content to send with the DMP.'))
        .addStringOption(option =>
            option.setName('override')
                .setDescription('Set this to anything if you want to override the date given. Removes warning on date overlap.')),
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

        let attachment = interaction.options.get("attachments");
        if (attachment) {
            let fpath = await downloadImage(attachment.attachment.url, 'imgs/' + date + '.png');
            attachments.push(fpath);
        }

        let answer = interaction.options.get("answer").value;

        let d = new Date(date + "T12:00:00.000-06:00"); // to post at noon CST / 1pm CDT
        let timestamp = d.valueOf();

        if (timestamp - Date.now() > 2147483647) return 11;
        
        let data = {
            "message": {
                content,
                attachments
            },
            answer,
            timestamp
        }

        let archive = require('../json/archives.json');
        if (archive[date] && !interaction.options.get("override")) return 10;

        let queue = require('../json/queue.json');
        if (queue[date] && !interaction.options.get("override")) return 10;
        queue[date] = data;

        await fs.writeFile('./json/queue.json', JSON.stringify(queue));

        require('../schedule-dmp.js')(interaction.client, queue, date);

        await interaction.followUp("Successfully queued DMP.");

        return 0;
    },
};