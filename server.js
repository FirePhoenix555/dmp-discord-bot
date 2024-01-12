const Discord = require('discord.js');
const { token, commandsDisabled, validUsers, responseCodes } = require('./json/config.json');
const { genCommands } = require('./util/commands.js');
require("./register-commands.js");

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.MessageContent] });

client.once(Discord.Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    let queue = require("./json/queue.json");
    for (let i = 0; i < Object.keys(queue).length; i++) {
        let date = Object.keys(queue)[i];
        require('./schedule-dmp.js')(client, queue, date);
    }

    client.user.setActivity("for new DMPs...", { type: Discord.ActivityType.Watching });
});

client.login(token);

client.commands = new Discord.Collection();
genCommands(cmd => {
    client.commands.set(cmd.data.name, cmd);
});

client.on(Discord.Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    await interaction.deferReply();

	const command = interaction.client.commands.get(interaction.commandName);

    // logging all commands
    let output = (interaction.member.nickname || interaction.user.username) + ":  /" + interaction.commandName + " ";

    for (i in interaction.options.data) {
        let option = interaction.options.data[i];
        if (option.attachment) output += option.name + ":" + option.attachment.url + " "; // log the url if it's an attachment (value is just an id)
        else output += option.name + ":" + option.value + " ";
    }

    console.log(output);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

    if (commandsDisabled) {
        if (!validUsers.includes(interaction.user.id)) {
            await interaction.followUp({ content: "Sorry, commands are temporarily disabled (probably I'm being tested elsewhere). Please try again later.", ephemeral: true });
            return;
        }
    }

	try {
		let res = await command.execute(interaction);
        if (res) { // error
            console.log("[ERROR] " + responseCodes[res]);
            
            let obj = {
                content: responseCodes[res],
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) await interaction.followUp(obj);
            else await interaction.reply(obj);
        }
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});