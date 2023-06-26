class MessageRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getMessages = () => {
        let result = this.dao.getMessages();
        return result;
    };

    addMessage = (newMessage) => {
        let result = this.dao.addMessage(newMessage);
        return result;
    };
}

module.exports = MessageRepository;
