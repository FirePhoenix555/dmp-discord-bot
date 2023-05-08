module.exports = {
    formatTimestamp(timestamp) {
        let date = new Date(timestamp);
        return this.formatDate(date);
    },

    formatDate(date) {
        let day = date.getDate().toLocaleString('en-US', { timeZone: 'America/Chicago', minimumIntegerDigits: 2 });
        let month = (date.getMonth() + 1).toLocaleString('en-US', { timeZone: 'America/Chicago', minimumIntegerDigits: 2 });
        let year = date.getFullYear().toLocaleString('en-US', { timeZone: 'America/Chicago', minimumIntegerDigits: 4 }).replace(",", "");
    
        return year + "-" + month + "-" + day;
    },

    getLastDate(archive) {
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
}