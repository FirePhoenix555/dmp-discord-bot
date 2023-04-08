const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('hello world')
		.setDescription('sends hello world msg'),
	async execute(interaction) {
		await interaction.reply('Hello, world!');
	},
};