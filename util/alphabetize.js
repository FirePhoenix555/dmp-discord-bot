module.exports = {
    alphabetize(leaderboard) {
        let l = {};
        let keys = Object.keys(leaderboard).sort();
        for (let i = 0; i < keys.length; i++) {
            l[keys[i]] = leaderboard[keys[i]];
        }
        return l;
    }
}