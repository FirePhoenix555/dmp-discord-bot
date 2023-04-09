const Discord = require('discord.js');
// const { channelId } = require('../config.json');
const fs = require('fs').promises;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('check')
        .setDescription('Check your answer to today\'s (or any other day\'s) DMP!')
        .addStringOption(option =>
            option.setName('answer')
                .setDescription('Your answer')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('date')
                .setDescription('The date of the DMP in "YYYY-MM-DD" format. Set to the most recent DMP if not included.')
                .setMaxLength(10)
                .setMinLength(10)),
    async execute(interaction) {
        const answer = interaction.options.get("answer").value;

        let archive = require('../archives.json');

        if (!archive || Object.keys(archive).length == 0) {
            await interaction.reply({ content: "Unfortunately, there are no DMPs currently in my archive. Please try again later.", ephemeral: true });
            return;
        }

        let date;
        if (interaction.options.get("date")) {
            date = interaction.options.get("date").value;
            if (!archive[date]) {
                await interaction.reply("That DMP doesn't exist! Make sure you formatted the date correctly.");
                return;
            } else if (!/\d\d\d\d-\d\d-\d\d/.test(date)) {
                await interaction.reply("Invalid date format.");
                return;
            }
        }
        else date = getLastDate(archive);
        
        if (checkAnswer(answer, archive[date].answer)) {
            await interaction.reply("Correct!");
        } else {
            await interaction.reply("Incorrect.");
        }
    },
};

function getLastDate(archive) {
    let latest = 0;
    let ls = "";
    for (s in archive) {
        let timestamp = archive[s].timestamp;
        if (timestamp > latest) {
            latest = timestamp;
            ls = s;
        }
    }
    return ls;
}

function checkAnswer(given, actual) {
    return given == actual; // for now, just comparing them character-by-character
}