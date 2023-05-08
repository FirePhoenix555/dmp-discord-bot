const Discord = require('discord.js');
const { validUsers } = require('../json/config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides information about a past DMP.')
        .addStringOption(option =>
            option.setName('date')
                .setDescription('The date of the DMP in "YYYY-MM-DD" format.')
                .setMaxLength(10)
                .setMinLength(10)
                .setRequired(true)),
    async execute(interaction) {
        let archive = require('../json/archives.json');

        if (!archive || Object.keys(archive).length == 0) {
            return 2;
        }

        let date = interaction.options.get("date").value;
        if (!archive[date]) {
            return 3;
        } else if (!/\d\d\d\d-\d\d-\d\d/.test(date)) {
            return 6;
        }

        let dmp = archive[date];

        let img = "";
        if (dmp.attachments.length > 0) {
            if (dmp.attachments[0].attachment) img = dmp.attachments[0].attachment.url;
            else img = dmp.attachments[0];
        }

        let leaderboard = require('../json/leaderboard.json');

        let user = interaction.user.id;

        let output;
        if (validUsers.includes(user)) {
            output = "Users that have solved this DMP:\n";

            for (let u in leaderboard) {
                if (date in leaderboard[u]) output += `<@${u}>\n`;
            }
        } else {
            if (!(user in leaderboard)) {
                leaderboard[user] = {};
            }

            let solved = date in leaderboard[user];
            output = solved ? "You've solved this DMP already!" : "Unfortunately, you have yet to get this DMP correct.";
        }

        let embed = new Discord.EmbedBuilder()
            //.setColor(0x0099FF)
            .setTitle('DMP information for ' + date)
            .addFields(
                { name: 'URL', value: dmp.url },
                { name: 'Solved status', value: output }
            )
            .setTimestamp(dmp.timestamp);
        if (img) embed.setImage(img);
        if (validUsers.includes(user)) embed.addFields({name: 'Answer', value: dmp.answer})

        if (dmp.content)
            embed.addFields(
                { name: 'Content', value: dmp.content }
            );

        await interaction.reply({ embeds: [embed], ephemeral: true });

        return 0;
    }
};