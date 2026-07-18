import Conversataion from "../models/conversataion.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];

        const conversation = await Conversataion.create({ userId: userId });

        return res.status(200).json(conversation);
    } catch (e) {
        return res.status(500).json({ message: `error createConversation ${e}` });
    }
};

export const getConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"]
        
        const conversations = await Conversataion.find({ userId: userId }).sort({ createdAt: -1 })
        return res.status(200).json(conversations)
    } catch (e) {
        return res.status(500).json({ message: `error getConversation ${e}` });
    }
}

export const saveMessage = async (req, res)=>{
    try {
        const { conversationId, role, content, images,artifacts } = req.body
        const message = await Message.create({
            conversationId,
            role,
            content,
            images,
            artifacts 
        })
        res.status(200).json(message)

    } catch (e) {
        return res.status(500).json({ message: `error saveMessage ${e}` });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params
        const messages = await Message.find({ conversationId: conversationId })
        res.status(200).json(messages)
    } catch (e) {
        return res.status(500).json({ message: `error getMessages ${e}` });
    }
}
export const updateConversation = async (req, res) => {
    try {
        const { id, title } = req.body;
        const updatedConversation = await Conversataion.findByIdAndUpdate(
            id,
            { title },
            { returnDocument: 'after' }
        );
        res.status(200).json(updatedConversation);
    } catch (e) {
        return res.status(500).json({ message: `error updateConversation ${e}` });
    }
};