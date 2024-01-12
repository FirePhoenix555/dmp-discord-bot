const Discord = require('discord.js');
const { helpMessages } = require('../json/config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists out my intro message.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to get specific help on.')),
    async execute(interaction) {

        if (!interaction.options.get("command")) {
            let embed = new Discord.EmbedBuilder()
                //.setColor(0x0099FF)
                .setTitle(helpMessages.title)
                .setDescription(helpMessages.intro1)
                .addFields(
                    { name: '`/check`', value: helpMessages.check },
                    { name: '`/leaderboard`', value: helpMessages.leaderboard },
                    { name: '`/info`', value: helpMessages.info },
                    { name: '`/help`', value: helpMessages.help },
                    { name: 'Admin Commands', value: helpMessages.intro2 },
                    { name: '`/archive`', value: helpMessages.archive },
                    { name: '`/queue`', value: helpMessages.queue },
                    { name: '`/grade`', value: helpMessages.grade },
                    { name: 'Code', value: helpMessages.foot }
                );

            await interaction.followUp({ embeds: [embed] });

            return 0;
        }

        let command = interaction.options.get("command").value.replaceAll("/", "");
        if (!helpMessages[command]) return 5;

        let embed = new Discord.EmbedBuilder()
            .setTitle(helpMessages.title)
            .setDescription(helpMessages.intro1)
            .addFields(
                { name: `\`/${command}\``, value: helpMessages[command] }
            );
        await interaction.followUp({ embeds: [embed] });
        return 0;
    }
};