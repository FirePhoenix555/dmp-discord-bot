const f = require('./post-dmp.js');

module.exports = async (client, queue, date) => {
    let dmp = queue[date];
    let timestamp = dmp.timestamp - Date.now();
    if (timestamp > 2147483647) return 1; // higher than setTimeout can take

    setTimeout(async () => {
        await f(client, dmp, date, queue);
    }, timestamp);
};