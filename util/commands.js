module.exports = {
    genCommands(cb) {
        require("../getCommands.js").forEach(cmd => {
            if ('data' in cmd && 'execute' in cmd)
                cb(cmd);
            else
                console.log(`[WARNING] The command ${cmd} is missing a required "data" or "execute" property.`);
        });
    }
}