const Discord = require('discord.js');
const { channelId } = require('../config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('archive')
        .setDescription('Archives a single DMP to the database.')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The message to archive.')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.client.channels.cache.get(channelId);
        const msgId = interaction.options.get("message_id").value;

        channel.messages.fetch(msgId)
        .then(message => {
            const msg = message.content;
            console.log(msg);
        }).catch(console.error);
    },
};