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
        
        let correct = check(answer, archive[date].answer);
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

            await fs.writeFile('./leaderboard.json', JSON.stringify(alphabetize(leaderboard)));

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

function alphabetize(leaderboard) {
    let l = {};
    let keys = Object.keys(leaderboard).sort();
    for (let i = 0; i < keys.length; i++) {
        l[keys[i]] = leaderboard[keys[i]];
    }
    return l;
}

// answer classes
const mcq = /^[abcde]$/;
const func = /^[a-z]\((.*?)\)=([a-z0-9.^/{}|_()%!\[\]+*-]*\1[a-z0-9.^/{}|_()%!\[\]+*-]*)$/;

function check(given, actual) {

    let answers = actual.split(",");
    let givens = given.split(",");

    let correct = true;

    // interpreting as unordered list (if given corresponds to any answer it's correct):
    for (let i = 0; i < givens.length; i++) {
        let g = givens[i].replaceAll("±", "+-");

        if (/\+-(.*)$/.test(g)) {
            g = g.replaceAll(/\+-(.*)$/g, "$1,-$1");
            let gn = g.split(",");
            givens.push(gn.slice(1).join(""));
            g = gn[0];
        }

        g = parseUserInput(g);

        // go through all answers and check if this matches any of them
        // cor=2 when given was invalid for every single answer
        // cor=1 when any answer was correct
        // cor=0 when at least one incorrect and no correct
        let cor = 2;
        for (let j = answers.length-1; j >=0; j--) {
            let a = parseUserInput(answers[j]);

            let c = checkAnswer(g, a);
            if (c == 0) {
                cor = 0;
            }
            else if (c == 1) {
                cor = 1;
                answers.splice(j, 1);
                break;
            }
        }
        if (cor == 2) return cor;
        else if (cor == 0) correct = cor;
    }

    if (answers.length > 0) return 0; // you didn't give every answer

    return correct;
}

function multiReplace(str, obj) {
    for (key in obj) {
        str = str.replaceAll(new RegExp(key, "g"), obj[key]);
    }
    return str;
}

function parseUserInput(input) {
    let i = input.toLowerCase().replaceAll(/\s/g, "");

    i = multiReplace(i, {
        "π": "pi",
        "θ": "t",
        "√": "sqrt",
        "([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖ𐞥ʳˢᵗᵘᵛʷˣʸᶻ]+)": "^($1)",
        "[+-]\\d*c$": "",
    });

    // if "function" isn't already prefixed with f(x)= or f(y)=, add it
    if (func.test("f(x)=" + i)) i = "f(x)=" + i;
    else if (func.test("f(y)=" + i)) i = "f(y)=" + i;
    else if (func.test("f(t)=" + i)) i = "f(t)=" + i;

    return i;
}

function checkAnswer(g, a) {

    if (mcq.test(a)) {
        if (!mcq.test(g)) return 2;

        let absoluteG = g.replaceAll(/[^abcde]/g, "");
        let absoluteA = a.replaceAll(/[^abcde]/g, "");

        return absoluteG == absoluteA;

    } else if (func.test(a)) {

        if (!func.test(g)) return 2;
        
        let arr = g.match(func);

        let gVar = arr[1];
        let gf = arr[2].replaceAll(gVar, "x");

        let aArr = a.match(func);
        let aVar = aArr[1];
        let af = aArr[2].replaceAll(aVar, "x");

        gf = gf.replaceAll(/([a-z]+)([x0-9])/g, "$1($2)"); // so you can't type "sinx" which mathjs doesn't know how to deal with
        af = af.replaceAll(/([a-z]+)([x0-9])/g, "$1($2)");

        return simplify(parse(gf)).equals(simplify(parse(af)));

    } else {
        try {
            return simplify(parse(g)).evaluate() == simplify(parse(a)).evaluate();
        } catch {
            return 2;
        }
    }
}