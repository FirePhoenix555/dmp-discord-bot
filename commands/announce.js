const Discord = require('discord.js');
const { validUsers, channelId } = require('../json/config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send an announcement.')
        .addStringOption(option =>
            option.setName('content')
                .setDescription('The message to announce.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('title')
                .setDescription('The title of the message. Set to \'Announcement\' if not specified.')),
    async execute(interaction) {
        // checking if the user is allowed to use this command (whitelist)
        if (!validUsers.includes(interaction.user.id)) {
            return 1;
        }

        let embed = new Discord.EmbedBuilder()
            .setTitle(interaction.options.get('title')?.value || 'Announcement')
            .setDescription(interaction.options.get('content').value);
    
        let channel = interaction.client.channels.cache.get(channelId);
        channel.send({ embeds: [embed] });

        await interaction.reply("Successfully sent announcement.");

        return 0;
    }
};