import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event';

const createEvent = (req: Request, res: Response, next: NextFunction) => {
    const { coordinates, eventName, idCategory, date, idUser, description, assistants, link, photo, idChat, idComments } = req.body;

    const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        eventName,
        coordinates,
        idCategory,
        date,
        idUser,
        description,
        assistants,
        link,
        photo,
        idChat,
        idComments
    });

    return event
        .save()
        .then((event) => res.status(201).json(event))
        .catch((error) => res.status(500).json({ error }));
};

const readEvent = (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;

    return Event.findById(eventId)
        .populate('assistants') //, 'idComments', 'idChat'
        .then((event) => (event ? res.status(200).json(event) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Event.find()
        .populate('idUser')
        .populate('assistants') //, 'idComments', 'idChat'
        .then((events) => {
            res.status(200).json(events);
        })
        .catch((error) => res.status(500).json({ error }));
};
/*
const updateEvent = (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;

    return Event.findByIdAndUpdate(eventId)
        .then((event) => {
            if (event) {
                event.set(req.body);

                return event
                    .save()
                    .then((event) => res.status(201).json(event))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
*/
const updateEvent = (req: Request, res: Response, next: NextFunction) => {
    const url = req.url;
    console.log(url);
    const urlSplitted: string[] = url.split('/');
    const id = urlSplitted[1];
    console.log(id);

    return Event.findByIdAndUpdate(id)
        .then((event) => {
            if (event) {
                event.set(req.body);

                return event
                    .save()
                    .then((savedEvent) => res.status(201).json(savedEvent))
                    .catch((saveError) => {
                        if (saveError.name === 'ValidationError') {
                            // Handle validation errors
                            return res.status(400).json({ message: saveError.message });
                        } else {
                            // Handle other save errors
                            return res.status(500).json({ message: 'Internal Server Error' });
                        }
                    });
            } else {
                return res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((findByIdAndUpdateError) => {
            // Handle errors that occur during findByIdAndUpdate
            return res.status(500).json({ message: 'Internal Server Error' });
        });
};

const deleteEvent = (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;

    return Event.findByIdAndDelete(eventId)
        .then((event) => (event ? res.status(201).json({ event, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createEvent, readEvent, readAll, updateEvent, deleteEvent };
