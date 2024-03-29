const Discord = require('discord.js');
const { validUsers } = require('../json/config.json');
const { formatDate } = require('../util/date.js');
const { archiveFromMessage } = require('../util/messages.js');
const fs = require('fs').promises;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('log')
        .setDescription('Legacy. Don\'t use unless you\'re me and know what this does.')
        .addStringOption(option =>
            option.setName('channel_id')
                .setDescription('The message containing the links.')
                .setRequired(true))
        // .addStringOption(option => 
        //     option.setName('channel_id')
        //         .setDescription('a')
        //         .setRequired(true))
        ,
    async execute(interaction) {
        // checking if the user is allowed to use this command (whitelist)
        if (!validUsers.includes(interaction.user.id)) {
            return 1;
        }

        await interaction.followUp("Archiving...");

        const chnId = interaction.options.get("channel_id").value;
        let chn = await interaction.client.channels.fetch(chnId);

        let archives = await chn.messages.fetch({ limit: 100 });
        // let ks = Array.from(archives.keys());

        await interaction.followUp("Got messages.");

        //console.log(ks);

        for (let [n, message] of archives) {
            await interaction.followUp("Archiving message " + n + "...");

            let archive = require('../json/archives.json');

            //let message = archives[ks[n]];

            // console.log(message);

            let lines = message.content.split("\n");

            for (let i = 0; i < lines.length; i++) {
                let comps = lines[i].split(" ");

                // if (comps.length < 2) continue; // not a link
                // if (lines[i] == "") break; // old weirdly formatted message, stop before dsmps etc

                try {
                    // get message info
                    let date = formatDate(new Date(comps[0].replace(":", "")));
                    let link = comps[1];

                    await interaction.followUp("Archiving message for date " + date + "...");

                    // load:
                    let result = parseDiscordLink(link);

                    let channel = await interaction.client.channels.fetch(result.channel);
                    let msg = await channel.messages.fetch(result.message);

                    let data = archiveFromMessage(msg, "PLACEHOLDER");
                    
                    if (archive[date]) return 10;

                    archive[date] = data;

                    //await interaction.followUp(date + " archived.");
                } catch {
                    continue; // something was weird anyway just move on
                }
            }

            await fs.writeFile('./json/archives.json', JSON.stringify(archive));

            await interaction.followUp("Archived.");
        }

        await interaction.followUp("Archiving complete.");

        return 0;
    },
};

function parseDiscordLink(link) {
    // https://discord.com/channels/[serverid]/[channelid]/[msgid]
    let s = link.split("/");
    let serverId = s[4];
    let channelId = s[5];
    let msgId = s[6];

    return {
        server: serverId,
        channel: channelId,
        message: msgId
    }
}