const Discord = require('discord.js');
// const { channelId } = require('../config.json');
const fs = require('fs').promises;
const { simplify, parse, evaluate } = require("mathjs");

const marginOfError = 0.001;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('check')
        .setDescription('Check your answer to today\'s (or any other day\'s) DMP!')
        .addStringOption(option =>
            option.setName('answer')
                .setDescription('Your answer')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('date')
                .setDescription('The date of the DMP in "YYYY-MM-DD" format. Set to the most recent DMP if not included.')
                .setMaxLength(10)
                .setMinLength(10)),
    async execute(interaction) {
        const answer = interaction.options.get("answer").value;

        let archive = require('../archives.json');

        if (!archive || Object.keys(archive).length == 0) {
            await interaction.reply({ content: "Unfortunately, there are no DMPs currently in my archive. Please try again later.", ephemeral: true });
            return;
        }

        let date;
        if (interaction.options.get("date")) {
            date = interaction.options.get("date").value;
            if (!archive[date]) {
                await interaction.reply("That DMP doesn't exist! Make sure you formatted the date correctly.");
                return;
            } else if (!/\d\d\d\d-\d\d-\d\d/.test(date)) {
                await interaction.reply("Invalid date format.");
                return;
            }
        }
        else date = getLastDate(archive);
        
        if (checkAnswer(answer, archive[date].answer)) {
            await interaction.reply("Correct!");
        } else {
            await interaction.reply("Incorrect.");
        }
    },
};

function getLastDate(archive) {
    let latest = 0;
    let ls = "";
    for (s in archive) {
        let timestamp = archive[s].timestamp;
        if (timestamp > latest) {
            latest = timestamp;
            ls = s;
        }
    }
    return ls;
}

function checkAnswer(given, actual) {
    let g = given.toLowerCase().replaceAll(/\s/g, "");
    let a = actual.toLowerCase().replaceAll(/\s/g, "");

    let mcq = /[abcde]/;
    let num = /^[0-9.^/{}()!\[\]-]+$/;
    let func = /[a-z]\((.*?)\)=([a-z0-9.^/{}|\\_()%$!\[\]-]+)/;
    let str = /^\D+$/;

    if (mcq.test(a)) {
        let absoluteG = g.replaceAll(/[^abcde]/g, "");
        let absoluteA = a.replaceAll(/[^abcde]/g, "");
        return absoluteG == absoluteA;

    } else if (num.test(a)) {
        let gNumStr = g.match(num)[0];
        let gNum = parse(gNumStr).evaluate();
        let aNumStr = a.match(num)[0];
        let aNum = parse(aNumStr).evaluate();

        return Math.abs(gNum - aNum) < marginOfError;

    } else if (func.test(a)) {
        let arr = g.match(func);
        if (arr) {
            let gVar = arr[1];
            let gf = arr[2].replaceAll(gVar, "x");

            let aArr = a.match(func);
            let aVar = aArr[1];
            let af = aArr[2].replaceAll(aVar, "x");

            for (let i = 0; i < 4; i++) {
                let x = Math.random() * 2000 - 1000; // random number from -1000 to 1000
                let gVal = simplify(parse(gf)).evaluate({ x });
                let aVal = simplify(parse(af)).evaluate({ x });
                if (Math.abs(gVal - aVal) > marginOfError) return false;
            }

            return true;
        } else {
            console.log("Invalid format");
            return false;
        }

    } else if (str.test(a)) {
        return g == a;
    }
}