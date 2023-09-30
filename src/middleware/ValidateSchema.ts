import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Response, Request } from 'express';
import Logging from '../library/Logging';
import { IUser } from '../models/User';
import { IEvent } from '../models/Events';

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
            idUser: Joi.number().required(),
            age: Joi.number().required(),
            password: Joi.string().required()
        }),
        update: Joi.object<IUser>({
            userName: Joi.string().required(),
            email: Joi.string().required(),
            idUser: Joi.number().required(),
            age: Joi.number().required(),
            password: Joi.string().required()

        })
    },
    event: {
        create: Joi.object<IEvent>({
            user: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .required(),
            place: Joi.string().required(),
            category: Joi.string().required(),
            eventName: Joi.string().required(),
            date: Joi.string().required()

        }),
        update: Joi.object<IEvent>({
            user: Joi.string()
                .regex(/^[0-9a-fA-F]{24}/)
                .required(),
           place: Joi.string().required(),
            category: Joi.string().required(),
            eventName: Joi.string().required(),
            date: Joi.string().required()
        })
    }
};
