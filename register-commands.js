const Discord = require('discord.js');
const { token, clientId } = require('./config.json');

let commands = [];

function addCommand(cmd) {
    if ('data' in cmd && 'execute' in cmd)
        commands.push(cmd.data.toJSON());
    else
        console.log(`[WARNING] The command ${cmd} is missing a required "data" or "execute" property.`);
}

require("./getCommands.js").forEach(addCommand);


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