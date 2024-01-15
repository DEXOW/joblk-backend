// controllers/message.js
const Message = require('../models/message');
const Conversation = require('../models/conversation'); // Assuming you have a Conversation model

module.exports = {
  getMessages: async (req, res) => {
    const conversationId = req.params.id;
    const message = new Message();
    const conversation = new Conversation();

    // Check if the conversation exists
    const conversationExists = await conversation.get(conversationId);
    if (!conversationExists) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    message.getByConversationId(conversationId)
      .then(messages => res.json(messages))
      .catch(err => res.status(500).json({error: err}));
  },

  createMessage: async (req, res) => {
    const conversationId = req.params.id;
    const senderId = req.user.id;
    const { messageContent } = req.body;
    const message = new Message();
    const conversation = new Conversation();

    // Check if the conversation exists
    const conversationExists = await conversation.get(conversationId);
    if (!conversationExists) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if the sender is part of the conversation
    if (senderId !== conversationExists.user_one_id && senderId !== conversationExists.user_two_id) {
      return res.status(403).json({ error: 'Sender not part of the conversation' });
    }

    message.create({ conversation_id:conversationId, sender_id:senderId, message_content:messageContent })
      .then(() => res.json({message: 'Message sent!'}))
      .catch(err => res.status(500).json({error: err}));
  }
};
