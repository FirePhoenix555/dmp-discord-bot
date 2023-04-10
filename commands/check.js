const Discord = require('discord.js');
 const { validUsers } = require('../config.json');
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
        // checking if the user is NOT allowed to use this command (whitelist)
        let validUser = false;
        for (let i = 0; i < validUsers.length; i++) {
            let userid = validUsers[i];
            if (interaction.user.id == userid) {
                validUser = true;
                break;
            }
        }
        if (validUser) {
            // await interaction.reply({ content: "Sorry, you are not authorized to use this command.", ephemeral: true });
            // return;
        }


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
                await interaction.reply({ content: "That DMP doesn't exist! It probably just hasn't been archived yet...", ephemeral: true });
                return;
            } else if (!/\d\d\d\d-\d\d-\d\d/.test(date)) {
                await interaction.reply({ content: "Invalid date format.", ephemeral: true });
                return;
            }
        }
        else date = getLastDate(archive);
        
        let correct = checkAnswer(answer, archive[date].answer);
        if (correct == 1) { // correct answer

            // add to leaderboard
            let user = interaction.user.id;
            let leaderboard = require('../leaderboard.json');

            if (!(user in leaderboard)) {
                leaderboard[user] = {};
            }

            let userInfo = leaderboard[user];

            if (date in userInfo) {
                await interaction.reply({ content: "You've already gotten this DMP correct!", ephemeral: true });
                return;
            }

            userInfo[date] = true;
            leaderboard[user] = userInfo;

            await fs.writeFile('./leaderboard.json', JSON.stringify(leaderboard));

            await interaction.channel.send({ content: `<@${interaction.user.id}> got the DMP for ${date} correct!`, "allowedMentions": { "users" : []}});
            await interaction.reply({ content: "Correct!", ephemeral: true });
        } else if (correct == 0) { // incorrect answer
            await interaction.reply({ content: "Incorrect.", ephemeral: true });
        } else { // error
            await interaction.reply({ content: "Invalid format.", ephemeral: true });
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

    let mcq = /^[abcde]$/;
    let num = /^[0-9.^/{}()!\[\]-]+$/;
    let func = /^[a-z]\((.*?)\)=([a-z0-9.^/{}|_()%!\[\]+*-]*\1[a-z0-9.^/{}|_()%!\[\]+*-]*)$/;
    let str = /^\D+$/;

    // if "function" isn't already prefixed with f(x)= or f(y)=, add it
    if (func.test("f(x)=" + g)) g = "f(x)=" + g;
    else if (func.test("f(y)=" + g)) g = "f(y)=" + g;

    if (func.test("f(x)=" + a)) a = "f(x)=" + a;
    else if (func.test("f(y)=" + a)) a = "f(y)=" + a;

    if (mcq.test(a)) {
        if (!mcq.test(g)) return 2;

        let absoluteG = g.replaceAll(/[^abcde]/g, "");
        let absoluteA = a.replaceAll(/[^abcde]/g, "");

        return absoluteG == absoluteA;

    } else if (num.test(a)) {
        if (!num.test(g)) return 2;

        let gNumStr = g.match(num)[0];
        let gNum = parse(gNumStr).evaluate();
        let aNumStr = a.match(num)[0];
        let aNum = parse(aNumStr).evaluate();

        return Math.abs(gNum - aNum) < marginOfError;

    } else if (func.test(a)) {
        g = g.replaceAll(/([a-z]+)([xy0-9])/g, "$1($2)"); // so you can't type "sinx" which mathjs doesn't know how to deal with

        if (!func.test(g)) return 2;
        
        let arr = g.match(func);

        let gVar = arr[1];
        let gf = arr[2].replaceAll(gVar, "x");

        let aArr = a.match(func);
        let aVar = aArr[1];
        let af = aArr[2].replaceAll(aVar, "x");

        return simplify(parse(gf)).equals(simplify(parse(af)));

    } else if (str.test(a)) {
        if (!str.test(g)) return 2;
        return g == a;

    } else {
        return 2;
    }
}