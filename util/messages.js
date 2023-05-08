module.exports = {
    archiveFromMessage(message, answer) {
        // getting attachments
        let att = [];
        message.attachments.forEach(attachment => {
            att.push(attachment.url);
        });
    
        let data = {
            "url": message.url,
            "channelId": message.channelId,
            "id": message.id,
            "content": message.content,
            "embeds": message.embeds,
            "attachments": att,
            "answer": answer,
            "timestamp": message.createdTimestamp
        };
    
        return data;
    }
}