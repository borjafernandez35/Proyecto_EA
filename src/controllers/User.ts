import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

export const validatePasswordStrength = (password: string) => {
    if (password.length < 8) {
        console.log('La contraseña debe tener al menos 8 caracteres.');
    }

    if (!/[A-Z]/.test(password)) {
        console.log('La contraseña debe contener al menos una letra mayúscula.');
    }

    if (!/[a-z]/.test(password)) {
        console.log('La contraseña debe contener al menos una letra minúscula.');
    }

    if (!/\d/.test(password)) {
        console.log('La contraseña debe contener al menos un número.');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        console.log('La contraseña debe contener al menos un carácter especial.');
    }

    return null;
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userName, email, birthDate, password, avatar, createdEventsId, joinedEventsId, idCategories, role, description } = req.body;

    // Verificar la robustez de la contraseña antes de guardar el usuario
    const passwordStrengthError = validatePasswordStrength(password);
    if (passwordStrengthError) {
        console.log(`Contraseña débil: ${passwordStrengthError}`);
        return res.status(400).json({ error: passwordStrengthError });
    }

    try {
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

        const savedUser = await user.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).json({ error });
    }
};

const readUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    return (
        User.findById(userId)
            //.populate('createdEventsId', 'joinedEventsId', 'idCategories')
            .then((user) => (user ? res.status(200).json(user) : res.status(404).json({ message: 'not found' })))
            .catch((error) => {
                console.error('Error al leer el usuario:', error);
                res.status(500).json({ error });
            })
    );
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return (
        User.find()
            //.populate('createdEventsId', 'joinedEventsId', 'idCategories')
            .then((users) => res.status(200).json(users))
            .catch((error) => {
                console.error('Error al leer todos los usuarios:', error);
                res.status(500).json({ error });
            })
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
                req.body.password = await user.encryptPassword(req.body.password);
                user.set(req.body);
            }

            const savedUser = await user.save();
            return res.status(201).json(savedUser);
        } else {
            return res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        return res.status(500).json({ error });
    }
};

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    return User.findByIdAndDelete(userId)
        .then((user) => (user ? res.status(201).json({ user, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => {
            console.error('Error al eliminar el usuario:', error);
            res.status(500).json({ error });
        });
};

export default { createUser, readUser, readAll, updateUser, deleteUser };
