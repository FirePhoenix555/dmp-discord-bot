const Discord = require('discord.js');
const { token, channelId, roleId } = require('./config.json');
require("./register-commands.js");
const fs = require('fs').promises;

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.MessageContent] });

client.once(Discord.Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    let d = new Date();
    let queue = require("./queue.json");
    for (date in queue) {
        setTimeout(async () => {await postDMP(queue[date], date, queue)}, queue[date].timestamp - d.valueOf());
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

async function postDMP(dmp, date, queue) {
    console.log("Posting DMP for " + date);

    // post
    const channel = client.channels.cache.get(channelId);
    const embed = {
        // color: 0x0099ff,
        title: 'DMP for ' + date,
        description: dmp.message.content,
        image: {
            url: dmp.message.attachments[0].attachment.url,
        }
    };
    
    let message = await channel.send({ content: `<@&${roleId}>`, embeds: [embed] });

    // add to archive
    const archive = require("./archives.json");
    let data = {
        "url": message.url,
        "channelId": message.channelId,
        "id": message.id,
        "content": dmp.message.content,
        "embeds": message.embeds,
        "attachments": dmp.message.attachments,
        "answer": dmp.answer,
        "timestamp": message.createdTimestamp
    };

    archive[date] = data;
    await fs.writeFile('./archives.json', JSON.stringify(archive));

    // remove from queue
    delete queue[date];
    await fs.writeFile('./queue.json', JSON.stringify(queue));

    console.log("DMP posted.");
}