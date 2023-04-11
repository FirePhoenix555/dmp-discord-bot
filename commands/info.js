const Discord = require('discord.js');
const { validUsers } = require('../config.json');
const fs = require('fs').promises;

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
        let archive = require('../archives.json');

        if (!archive || Object.keys(archive).length == 0) {
            await interaction.reply({ content: "Unfortunately, there are no DMPs currently in my archive. Please try again later.", ephemeral: true });
            return;
        }

        let date = interaction.options.get("date").value;
        if (!archive[date]) {
            await interaction.reply({ content: "That DMP doesn't exist! It probably just hasn't been archived yet...", ephemeral: true });
            return;
        } else if (!/\d\d\d\d-\d\d-\d\d/.test(date)) {
            await interaction.reply({ content: "Invalid date format.", ephemeral: true });
            return;
        }

        let dmp = archive[date];

        let img = "";
        if (dmp.attachments.length > 0) {
            if (dmp.attachments[0].attachment) img = dmp.attachments[0].attachment.url;
            else img = dmp.attachments[0];
        }

        let leaderboard = require('../leaderboard.json');

        if (!(user in leaderboard)) {
            leaderboard[user] = {};
        }

        let user = interaction.user.id;
        let solved = date in leaderboard[user];

        let output = solved ? "You've solved this DMP already!" : "Unfortunately, you have yet to get this DMP correct.";

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

        embed.addFields(
            { name: 'Content', value: dmp.content }
        );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};