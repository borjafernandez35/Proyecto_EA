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
            birthDate: Joi.date().required(),
            password: Joi.string().required(),
            avatar: Joi.string().required(),
            createdEventsId: Joi.array().items(Joi.string().required()),
            joinedEventsId: Joi.array().items(Joi.string().required()),
            idCategories: Joi.array().items(Joi.string().required())
        }),
        update: Joi.object<IUser>({
            userName: Joi.string().required(),
            email: Joi.string().required(),
            birthDate: Joi.date().required(),
            password: Joi.string().required(),
            avatar: Joi.string().required(),
            createdEventsId: Joi.array().items(Joi.string().required()),
            joinedEventsId: Joi.array().items(Joi.string().required()),
            idCategories: Joi.array().items(Joi.string().required())
        })
    },
    event: {
        create: Joi.object<IEvent>({
            idUser: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .required(),
            coordinates: Joi.array().items(Joi.number().required()), //limitar a dos
            eventName: Joi.string().required(),
            idCategory: Joi.array().items(Joi.string().required()),
            date: Joi.date().required(),
            description: Joi.string().required(),
            assistants: Joi.array().items(Joi.string().required()),
            link: Joi.string().required(),
            photo: Joi.string().required(),
            idChat: Joi.string().required(),
            idComments: Joi.array().items(Joi.string().required())
        }),
        update: Joi.object<IEvent>({
            idUser: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .required(),
            coordinates: Joi.array().items(Joi.number().required()), //limitar a dos
            eventName: Joi.string().required(),
            idCategory: Joi.array().items(Joi.string().required()),
            date: Joi.date().required(),
            description: Joi.string().required(),
            assistants: Joi.array().items(Joi.string().required()),
            link: Joi.string().required(),
            photo: Joi.string().required(),
            idChat: Joi.string().required(),
            idComments: Joi.array().items(Joi.string().required())
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
            photo: Joi.string().required(),
            groupName: Joi.string().required(),
            idParticipants: Joi.array().items(Joi.string().required()),
            idMessages: Joi.array().items(Joi.string().required()),
            idEvent: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .required()
        }),
        update: Joi.object<IChat>({
            photo: Joi.string().required(),
            groupName: Joi.string().required(),
            idParticipants: Joi.array().items(Joi.string().required()),
            idMessages: Joi.array().items(Joi.string().required()),
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
                    .required()
            ),
            idEvents: Joi.array().items(
                Joi.string()
                    .regex(/^[0-9a-fA-F]{24}/)
                    .required()
            ),
            categoryName: Joi.string().required()
        }),
        update: Joi.object<ICategory>({
            idUsers: Joi.array().items(
                Joi.string()
                    .regex(/^[0-9a-fA-F]{24}/)
                    .required()
            ),
            idEvents: Joi.array().items(
                Joi.string()
                    .regex(/^[0-9a-fA-F]{24}/)
                    .required()
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
            punctuation: Joi.number().required()
        }),
        update: Joi.object<IComment>({
            userId: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .required(),
            text: Joi.string().required(),
            punctuation: Joi.number().required()
        })
    }
};
