import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

const createUser = (req: Request, res: Response, next: NextFunction) => {
    const { userName, email, birthDate, password, avatar, createdEventsId, joinedEventsId, idCategories, role, description } = req.body;

    const user = new User({
        userName,
        email,
        birthDate,
        password,
        avatar,
        createdEventsId,
        joinedEventsId,
        idCategories,
        role,
        description
    });

    return user
        .save()
        .then((user) => res.status(201).json(user))
        .catch((error) => res.status(500).json({ error }));
};

const readUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    return (
        User.findById(userId)
            //.populate('createdEventsId', 'joinedEventsId', 'idCategories')
            .then((user) => (user ? res.status(200).json(user) : res.status(404).json({ message: 'not found' })))
            .catch((error) => res.status(500).json({ error }))
    );
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return (
        User.find()
            //.populate('createdEventsId', 'joinedEventsId', 'idCategories')
            .then((users) => res.status(200).json(users))
            .catch((error) => res.status(500).json({ error }))
    );
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (user) {
            if (user.password === req.body.password) {
                user.set(req.body);
            } else {
                user.password = await user.encryptPassword(req.body.password);
            }

            const savedUser = await user.save();
            return res.status(201).json(savedUser);
        } else {
            return res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    return User.findByIdAndDelete(userId)
        .then((user) => (user ? res.status(201).json({ user, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createUser, readUser, readAll, updateUser, deleteUser };
