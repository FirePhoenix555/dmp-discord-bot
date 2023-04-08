const Discord = require('discord.js');
const { token } = require('./config.json');

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

client.once(Discord.Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);

client.commands = new Discord.Collection();

function addCommand(cmd) {
    if ('data' in cmd && 'execute' in cmd)
        client.commands.set(cmd.data.name, cmd);
    else
        console.log(`[WARNING] The command ${cmd} is missing a required "data" or "execute" property.`);
}

addCommand(require('./commands/test.js'));


client.on(Discord.Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});