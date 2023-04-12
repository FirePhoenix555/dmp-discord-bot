const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists out my intro message.'),
    async execute(interaction) {

        let title = "DMP Discord Bot";
        let intro1 = "Hello! I'm the official bot for Daily Math Problems! I help out my programmer, <@294217544904998927>, with some tasks relating to posting and archiving DMPs, but you can use me too:";
        let checkDesc = "Check your answer to a DMP! Any DMP in my archive (no matter how old) can be checked, so long as you haven't already gotten it correct... You can provide a date in this command to check a specific day's DMP, or you can leave the date field blank to check your answer for the most recently posted DMP.";
        let lbDesc = "Display the DMP solving leaderboard! I keep track of a leaderboard based on your attempt history for any DMPs in my archive. You can display that with this command. I hope this encourages you to keep up the work on math problems!";
        let infoDesc = "Provide information about a past DMP! Just enter the date and I'll tell you some information about a DMP in my archive, including a link to the post, the content and attachments, and whether or not you've solved it yet.";
        let helpDesc = "List out my intro message. Pretty self-explanatory; responds to the command with this message.";
        let intro2 = "And, if you happen to be my programmer (I don't know why you're here for this but I suppose I'll help anyway), here are some of your commands:";
        let arcDesc = "Archive a single DMP to the database! You can add DMPs to my archive file using this command. Simply provide the ID of the message and the date and answer of the DMP, and I'll take care of the archiving for you.";
        let qDesc = "Queue a DMP to be posted on a specified date! Your DMP will be posted at 12 PM CST / 1 PM CDT on the specified day. Make sure to provide the date, answer, and any content or attachments for the DMP.";
        let foot = "My code is publicly available on GitHub! You can check it out [here](https://github.com/FirePhoenix555/dmp-discord-bot).";
        
        let embed = new Discord.EmbedBuilder()
            //.setColor(0x0099FF)
            .setTitle(title)
            .setDescription(intro1)
            .addFields(
                { name: '`/check`', value: checkDesc },
                { name: '`/leaderboard`', value: lbDesc },
                { name: '`/info`', value: infoDesc },
                { name: '`/help`', value: helpDesc },
                { name: 'Admin Commands', value: intro2 },
                { name: '`/archive`', value: arcDesc },
                { name: '`/queue`', value: qDesc },
                { name: 'Code', value: foot }
            );

        await interaction.reply({ embeds: [embed] });
    }
};