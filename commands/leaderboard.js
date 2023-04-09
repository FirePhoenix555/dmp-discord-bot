const Discord = require('discord.js');
const fs = require('fs').promises;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the DMP solving leaderboard.'),
    async execute(interaction) {
        let leaderboard = require('../leaderboard.json');

        let rank = [];
        for (user in leaderboard) {
            let count = 0;
            for (date in leaderboard[user]) {
                if (leaderboard[user][date]) count++;
            }
            rank.push({user, count});
        }
        rank.sort((a, b) => b.count - a.count);

        let output = "";
        for (let i = 0; i < Math.min(10, rank.length); i++) {
            output += `${i+1}. <@${rank[i].user}>: ${rank[i].count}\n`;
        }
        
        if (!output) output = "Unfortunately there is no current leaderboard. Go ahead and answer a DMP to show up here!";

        await interaction.reply({content: output, "allowedMentions": { "users" : []}});
    },
};