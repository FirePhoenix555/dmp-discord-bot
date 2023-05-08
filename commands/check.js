const Discord = require('discord.js');
 const { validUsers } = require('../config.json');
const fs = require('fs').promises;
const { simplify, parse } = require("mathjs");

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
        if (validUsers.includes(interaction.user.id)) {
            // return 1;
        }

        const answer = interaction.options.get("answer").value;

        let archive = require('../archives.json');

        if (!archive || Object.keys(archive).length == 0) {
            return 2;
        }

        let date;
        if (interaction.options.get("date")) {
            date = interaction.options.get("date").value;
            if (!archive[date]) {
                return 3;
            } else if (!/\d\d\d\d-\d\d-\d\d/.test(date)) {
                return 6;
            }
        }
        else date = getLastDate(archive);

        if (/^\|\|.*\|\|$/.test(answer)) {
            return 9;

            // answer = answer.match(/^\|\|(.*)\|\|$/)[1];
        }
        
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
                return 8;
            }

            userInfo[date] = true;
            leaderboard[user] = userInfo;

            await fs.writeFile('./leaderboard.json', JSON.stringify(alphabetize(leaderboard)));

            await interaction.channel.send({ content: `<@${interaction.user.id}> got the DMP for ${date} correct!`, "allowedMentions": { "users" : []}});
            await interaction.reply({ content: "Correct!", ephemeral: true });
        } else if (correct == 0) { // incorrect answer
            await interaction.reply({ content: "Incorrect.", ephemeral: true });
        } else { // error
            return 5;
        }
        
        return 0;
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
const mcq = /^[abcd]$/;
const func = /^([a-z])\(([a-z])\)=/;
const pureNum = /^([0-9.,]+)$/;
const expr = /([^a-z]|^)+([a-z])([^(a-z]+[^a-z]*[^)a-z]*([^a-z]|$)+|$)/;

function check(given, actual) {

    let answers = actual.split(";");
    let givens = given.split(";");

    let correct = true;

    // interpreting as unordered list (if given corresponds to any answer it's correct):
    for (let i = 0; i < givens.length; i++) {
        let g = givens[i].replaceAll("±", "+-");

        if (/\+-(.*)$/.test(g)) {
            g = g.replaceAll(/\+-(.*)$/g, "$1;-$1");
            let gn = g.split(";");
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
        let r = new RegExp(key, "g");
        let i = 0;
        while (r.test(str)) {
            str = str.replaceAll(r, obj[key]);
            i++;
            if (i > 50) {
                throw new Error("Too many replaces: infinite loop detected (or answer is too long)");
                break;
            }
        }
    }
    return str;
}

function parseUserInput(input) {
    let r = {};

    let i = input.toLowerCase().replaceAll(/\s/g, "");

    i = multiReplace(i, {
        "°": "",
        "$": "",
        "π": "pi",
        "θ": "t",
        "theta": "t",
        "√": "sqrt",
        "([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖ𐞥ʳˢᵗᵘᵛʷˣʸᶻ]+)": "^($1)",
        "[+-]\\d*c$": "", // no +Cs
        "([a-z]{2,})([^();=a-z])": "$1($2)", // no sqrtx
        "log\\(([^;=]+)\\)": "log($1,10)", // replacing log base 10
        "ln\\(([^;=]+)\\)": "log($1)", // replacing log base e
        "log_([^;=])\\(([^;=]+)\\)": "log($2,$1)", // replacing log base (1 char)
        "log_{([^;=]+)}\\(([^;=]+)\\)": "log($2,$1)" // replacing log base (2+ char)
    });
    
    if (mcq.test(i)) {
        r.type = "mcq";
    } else if (expr.test(i)) {
        let f = "f"; // function
        if (func.test(i)) f = i.match(func)[1];
        let v = i.match(expr)[2] || i.match(func)[2]; // variable

        if (["e", "c"].includes(v)) return {i, type: "other"}; // this shouldn't be interpreted as a variable-

        if (func.test(i)) {
            r.expr = i.replaceAll(new RegExp(func, "g"), "");
        } else {
            r.expr = i;
            i = f + "(" + v + ")=" + i;
        }

        r.f = f;
        r.v = v;
        r.type = "expr";
    } else if (pureNum.test(i)) {
        r.type = "pureNum";
    } else {
        r.type = "other";
    }

    r.i = i;
    return r;
}

function checkAnswer(g, a) {
    let isemcq = a == "e" && mcq.test(g);
    
    if (isemcq || a.type == "mcq") {
        if (g.type != "mcq" && !/e/.test(g.i)) return 2;

        let absoluteG = g.i.replaceAll(/[^abcde]/g, "");
        let absoluteA = a.i.replaceAll(/[^abcde]/g, "");

        return absoluteG == absoluteA;

    } else if (a.type == "pureNum") {
        if (g.type != "pureNum" && !/e/.test(g.i)) return 2;
        else if (/e/.test(g.i)) return false;
        return parseFloat(a.i) == parseFloat(g.i);

    } else if (a.type == "expr") {
        if (g.type == "mcq") return 2;

        if (g.type == "pureNum" || g.type == "other") {
            g.expr = g.i;
        }

        try {
            return simplify(parse(g.expr)).equals(simplify(parse(a.expr)));
        } catch {
            return 2;
        }
    } else {
        try {
            return simplify(parse(g.i)).evaluate() == simplify(parse(a.i)).evaluate();
        } catch {
            return 2;
        }
    }
}