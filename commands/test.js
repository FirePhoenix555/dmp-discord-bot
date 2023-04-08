const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('helloworld')
		.setDescription('sends hello world msg'),
	async execute(interaction) {
		await interaction.reply('Hello, world!');
	},
};