const Discord = require('discord.js');
const { formattingGuidelines } = require('../json/config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('formatting')
        .setDescription('Lists formatting guidelines for DMP answers.'),
    async execute(interaction) {
        let embed = new Discord.EmbedBuilder()
            //.setColor(0x0099FF)
            .setTitle('Formatting Guidelines')
            //.setDescription("[]")
            .addFields(
                { name: '__Allowed Answer Formats__', value: ' ' },
                { name: 'MCQs', value: formattingGuidelines.mcqs, inline: true },
                { name: 'Numbers', value: formattingGuidelines.nums, inline: true },
                { name: ' ', value: ' ' },
                { name: 'Functions/Expressions', value: formattingGuidelines.funcexprs, inline: true },
                { name: 'Matrices', value: formattingGuidelines.matrs, inline: true },
                { name: ' ', value: ' ' },
                { name: '__Miscellaneous__', value: ' ' },
                { name: 'Replaced Symbols', value: formattingGuidelines.misc1, inline: true },
                { name: 'Allowed Functions', value: formattingGuidelines.misc2, inline: true },
                { name: 'Multiple Answers', value: formattingGuidelines.misc3, inline: true },
                { name: 'Other', value: formattingGuidelines.misc4 },
            );

        await interaction.reply({ embeds: [embed], ephemeral: true });

        return 0;
    }
};