module.exports = {
    genCommands(cb) {
        require("../getCommands.js").forEach(cmd => {
            if ('data' in cmd && 'execute' in cmd)
                cb(cmd);
            else
                console.log(`[WARNING] The command ${(cmd.data && cmd.data.name) ? cmd.data.name : "[undefined]"} is missing a required "data" or "execute" property.`);
        });
    }
}