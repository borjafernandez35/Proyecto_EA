import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat';

const createChat = (req: Request, res: Response, next: NextFunction) => {
    const { photo, groupName, idParticipants, idMessages, idEvent } = req.body;

    const chat = new Chat({
        _id: new mongoose.Types.ObjectId(),
        photo,
        groupName,
        idParticipants,
        idMessages,
        idEvent
    });

    return chat
        .save()
        .then((chat) => res.status(201).json(chat))
        .catch((error) => res.status(500).json({ error }));
};

const readChat = (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;

    return Chat.findById(chatId)
        .populate('idParticipants', 'idMessages', 'idEvent')
        .then((chat) => (chat ? res.status(200).json(chat) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Chat.find()
        .populate('idParticipants', 'idMessages', 'idEvent')
        .then((chats) => res.status(200).json(chats))
        .catch((error) => res.status(500).json({ error }));
};

const updateChat = (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;

    return Chat.findById(chatId)
        .then((chat) => {
            if (chat) {
                chat.set(req.body);

                return chat
                    .save()
                    .then((chat) => res.status(201).json(chat))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteChat = (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;

    return Chat.findByIdAndDelete(chatId)
        .then((chat) => (chat ? res.status(201).json({ chat, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createChat, readChat, readAll, updateChat, deleteChat };
