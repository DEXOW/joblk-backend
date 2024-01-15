const Conversation = require('../models/conversation');

module.exports = {
    getConversation: (req, res) => {
        const job_id = req.params.id;
        const conversation = new Conversation();

        conversation.getConversationByJobId(job_id)
            .then(conversation => res.json(conversation))
            .catch(err => res.status(500).json({ error: err }));
    },

    //Get all conversations related to a user
    getConversations: async (req, res) => {
        const user_id = req.user.id;
        const conversation = new Conversation();

        try {
            const conversations = await conversation.getConversationsByUserId(user_id);
            res.json(conversations);
        } catch (err) {
            res.status(500).json({ error: err.toString() });
        }
    },

    createConversation: async (req, res) => {
        const user_one_id = req.user.id;
        const { user_id } = req.body;
        const user_two_id = user_id;
        const conversation = new Conversation();

        try {
            const userOneExists = await conversation.checkUserExists(user_one_id);
            const userTwoExists = await conversation.checkUserExists(user_two_id);

            if (!userOneExists || !userTwoExists) {
                return res.status(400).json({ code: "Error", message: 'One of the users does not exist' });
            }

            const existingConversation = await conversation.getByUserIds(user_one_id, user_two_id);

            if (existingConversation) {
                return res.status(400).json({ code: "Error", message: 'Conversation already exists' });
            }

            await conversation.create({ user_one_id, user_two_id });
            res.json({ code: "Success", message: 'Conversation created!' });
        } catch (err) {
            res.status(500).json({ error: err.toString() });
        }
    }
};
