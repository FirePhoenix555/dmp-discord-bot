const Discord = require('discord.js');
const { token } = require('./config.json');

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

client.once(Discord.Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);
