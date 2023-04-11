const Discord = require('discord.js');
// const { channelId } = require('../config.json');
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
        let url = dmp.url;

        let leaderboard = require('../leaderboard.json');

        let user = interaction.user.id;
        let solved = date in leaderboard[user];

        let output = solved ? "You've solved this DMP already!" : "Unfortunately, you have yet to get this DMP correct.";

        let embed = new Discord.EmbedBuilder()
            //.setColor(0x0099FF)
            .setTitle('DMP information for ' + date)
            .addFields(
                { name: 'URL', value: url },
                { name: 'Solved status', value: output }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};