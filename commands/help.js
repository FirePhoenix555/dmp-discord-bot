const Discord = require('discord.js');
const { helpMessages } = require('../json/config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists out my intro message.'),
    async execute(interaction) {
        let embed = new Discord.EmbedBuilder()
            //.setColor(0x0099FF)
            .setTitle(helpMessages.title)
            .setDescription(helpMessages.intro1)
            .addFields(
                { name: '`/check`', value: helpMessages.checkDesc },
                { name: '`/leaderboard`', value: helpMessages.lbDesc },
                { name: '`/info`', value: helpMessages.infoDesc },
                { name: '`/help`', value: helpMessages.helpDesc },
                { name: 'Admin Commands', value: helpMessages.intro2 },
                { name: '`/archive`', value: helpMessages.arcDesc },
                { name: '`/queue`', value: helpMessages.qDesc },
                { name: 'Code', value: helpMessages.foot }
            );

        await interaction.reply({ embeds: [embed] });

        return 0;
    }
};