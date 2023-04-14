const f = require('./post-dmp.js');

module.exports = async (date, dmp) => {
    let timestamp = dmp.timestamp - Date.now();
    if (timestamp > 2147483647) return 1; // higher than setTimeout can take

    setTimeout(async () => {
        await f(client, dmp, date, queue);
    }, timestamp);
};