const Discord = require('discord.js');
const { token, clientId } = require('./json/config.json');
const { genCommands } = require('./util/commands.js');

let commands = [];
genCommands(cmd => {
	commands.push(cmd.data.toJSON());
});

// Registering commands
const rest = new Discord.REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Discord.Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();