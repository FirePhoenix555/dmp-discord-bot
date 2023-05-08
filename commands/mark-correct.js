const Discord = require('discord.js');
const { validUsers } = require('../config.json');
const { getLastDate } = require('../util/date.js');
const { alphabetize } = require('../util/alphabetize.js');
const fs = require('fs').promises;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('grade')
        .setDescription('Grade someone\'s response to a DMP!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to grade.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('correct')
                .setDescription('Set to "true" if their response is correct, and "false" if not.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('date')
                .setDescription('The date of the DMP in "YYYY-MM-DD" format. Set to the most recent DMP if not included.')
                .setMaxLength(10)
                .setMinLength(10)),
    async execute(interaction) {
        // checking if the user is allowed to use this command (whitelist)
        if (!validUsers.includes(interaction.user.id)) {
            return 1;
        }

        let isCorrect;
        if (interaction.options.get("correct").value == "true") {
            isCorrect = true;
        } else if (interaction.options.get("correct").value == "false") {
            isCorrect = false;
        } else {
            return 5;
        }

        let archive = require('../archives.json');

        if (!archive || Object.keys(archive).length == 0) {
            return 2;
        }

        let date;
        if (interaction.options.get("date")) {
            date = interaction.options.get("date").value;
            if (!archive[date]) {
                return 3;
            } else if (!/\d\d\d\d-\d\d-\d\d/.test(date)) {
                return 6;
            }
        }
        else date = getLastDate(archive);

        if (isCorrect) {
            // add to leaderboard
            let user = interaction.options.get("user").value;
            let leaderboard = require('../leaderboard.json');

            if (!(user in leaderboard)) {
                leaderboard[user] = {};
            }

            let userInfo = leaderboard[user];

            if (date in userInfo) {
                return 8;
            }

            userInfo[date] = true;
            leaderboard[user] = userInfo;

            await fs.writeFile('./leaderboard.json', JSON.stringify(alphabetize(leaderboard)));

            await interaction.reply({ content: `<@${user}> got the DMP for ${date} correct!`, "allowedMentions": { "users" : []}});
        } else {
            await interaction.reply({ content: "Noted." });
        }
        
        return 0;
    }
};