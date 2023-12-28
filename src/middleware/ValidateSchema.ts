import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Response, Request } from 'express';
import Logging from '../library/Logging';
import { IUser } from '../models/User';
import { IEvent } from '../models/Event';
import { IMessage } from '../models/Message';
import { IChat } from '../models/Chat';
import { IComment } from '../models/Comment';
import { ICategory } from '../models/Category';

export const ValidateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        } catch (error) {
            Logging.error(error);
            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    user: {
        create: Joi.object<IUser>({
            userName: Joi.string().required(),
            email: Joi.string().required(),
            birthDate: Joi.date().iso().optional(),
            password: Joi.string().required(),
            avatar: Joi.string().optional(),
            createdEventsId: Joi.array().items(Joi.string().optional()),
            joinedEventsId: Joi.array().items(Joi.string().optional()),
            idCategories: Joi.array().items(Joi.string().optional()),
            role: Joi.string().optional(),
            description: Joi.string().optional()
        }),
        update: Joi.object<IUser>({
            userName: Joi.string().required(),
            email: Joi.string().required(),
            birthDate: Joi.date().iso().optional(),
            password: Joi.string().required(),
            avatar: Joi.string().optional(),
            createdEventsId: Joi.array().items(Joi.string().optional()),
            joinedEventsId: Joi.array().items(Joi.string().optional()),
            idCategories: (Joi.string().optional()), //es un array pero se hace el convert
            role: Joi.string().optional(),
            description: Joi.string().optional()
        })
    },
    event: {
        create: Joi.object<IEvent>({
            idUser: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .optional(),
            coordinates: Joi.array().items(Joi.number().required()), //limitar a dos
            eventName: Joi.string().required(),
            idCategory: Joi.array().items(Joi.string().optional()),
            date: Joi.date().required(),
            description: Joi.string().required(),
            assistants: Joi.array().items(Joi.string().optional()),
            link: Joi.string().optional(),
            photo: Joi.string().optional(),
            idChat: Joi.string().optional(),
            idComments: Joi.array().items(Joi.string().optional())
        }),
        update: Joi.object<IEvent>({
            idUser: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .optional(),
            coordinates: Joi.array().items(Joi.number().optional()), //limitar a dos
            eventName: Joi.string().optional(),
            idCategory: Joi.array().items(Joi.string().optional()),
            date: Joi.date().optional(),
            description: Joi.string().optional(),
            assistants: Joi.array().items(Joi.string().optional()),
            link: Joi.string().optional(),
            photo: Joi.string().optional(),
            idChat: Joi.string().optional(),
            idComments: Joi.array().items(Joi.string().optional())
        })
    },
    message: {
        create: Joi.object<IMessage>({
            idUser: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .required(),
            text: Joi.string().required()
        }),
        update: Joi.object<IMessage>({
            idUser: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .required(),
            text: Joi.string().required()
        })
    },
    chat: {
        create: Joi.object<IChat>({
            photo: Joi.string().optional(),
            groupName: Joi.string().required(),
            idParticipants: Joi.array().items(Joi.string().required()),
            idMessages: Joi.array().items(Joi.string().optional()),
            idEvent: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .required()
        }),
        update: Joi.object<IChat>({
            photo: Joi.string().optional(),
            groupName: Joi.string().required(),
            idParticipants: Joi.array().items(Joi.string().required()),
            idMessages: Joi.array().items(Joi.string().optional()),
            idEvent: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .required()
        })
    },
    category: {
        create: Joi.object<ICategory>({
            idUsers: Joi.array().items(
                Joi.string()
                    .regex(/^[0-9a-fA-F]{24}/)
                    .optional()
            ),
            idEvents: Joi.array().items(
                Joi.string()
                    .regex(/^[0-9a-fA-F]{24}/)
                    .optional()
            ),
            categoryName: Joi.string().required()
        }),
        update: Joi.object<ICategory>({
            idUsers: Joi.array().items(
                Joi.string()
                    .regex(/^[0-9a-fA-F]{24}/)
                    .optional()
            ),
            idEvents: Joi.array().items(
                Joi.string()
                    .regex(/^[0-9a-fA-F]{24}/)
                    .optional()
            ),
            categoryName: Joi.string().required()
        })
    },
    comment: {
        create: Joi.object<IComment>({
            userId: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .required(),
            text: Joi.string().required(),
            date: Joi.date().required(),
            punctuation: Joi.number().optional()
        }),
        update: Joi.object<IComment>({
            userId: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .required(),
            text: Joi.string().required(),
            date: Joi.date().required(),
            punctuation: Joi.number().optional()
        })
    }
};
