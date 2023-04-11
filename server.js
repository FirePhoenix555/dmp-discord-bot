const Discord = require('discord.js');
const { token, channelId, roleId, commandsDisabled, validUsers } = require('./config.json');
require("./register-commands.js");
const fs = require('fs').promises;

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.MessageContent] });

client.once(Discord.Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    let d = new Date();
    let queue = require("./queue.json");
    let f = require('./post-dmp.js');
    for (let i = 0; i < Object.keys(queue).length; i++) {
        let date = Object.keys(queue)[i];
        let dmp = queue[date];
        setTimeout(async () => {
            await f(client, dmp, date, queue);
        }, dmp.timestamp - d.valueOf());
    }
});

client.login(token);

client.commands = new Discord.Collection();

function addCommand(cmd) {
    if ('data' in cmd && 'execute' in cmd)
        client.commands.set(cmd.data.name, cmd);
    else
        console.log(`[WARNING] The command ${cmd} is missing a required "data" or "execute" property.`);
}

require("./getCommands.js").forEach(cmd => {
    addCommand(cmd);
})

client.on(Discord.Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

    // logging all commands
    let output = (interaction.member.nickname || interaction.user.username) + ":  /" + interaction.commandName + " ";

    for (i in interaction.options.data) {
        let option = interaction.options.data[i];
        output += option.name + ":" + option.value + " ";
    }

    console.log(output);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

    if (commandsDisabled) {
        if (!validUsers.includes(interaction.user.id)) {
            await interaction.reply({ content: "Sorry, commands are temporarily disabled (probably I'm being tested elsewhere). Please try again later.", ephemeral: true });
            return;
        }
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