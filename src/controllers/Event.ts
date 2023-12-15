import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event';

const createEvent = (req: Request, res: Response, next: NextFunction) => {
    const { eventName, idCategory, date, idUser, description, assistants, link, photo, idChat, idComments } = req.body;
    let { coordinates } = req.body;

    if (coordinates && coordinates.length === 2) {
        // convertimos a objeto GeoJSON
        coordinates = {
            type: 'Point',
            coordinates: coordinates
        };
    } else {
        // error si las coordenadas no son validas
        return res.status(400).json({ message: 'Coordenadas inválidas. Deben ser un array de longitud 2.' });
    }

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

const getEventsUser = (req: Request, res: Response, next: NextFunction) => {
    const url = req.url;
    const urlSplitted: string[] = url.split('/');
    const idUser = urlSplitted[2];

    return Event.find({ idUser: idUser })
        .then((events) => {
            res.status(200).json(events);
        })
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

const updateEvent = (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;

    return Event.findById(eventId)
        .then((event) => {
            if (event) {
                // Usar el método 'set' para actualizar el documento
                event.set(req.body);

                return event
                    .save()
                    .then((savedEvent) => res.status(200).json(savedEvent))
                    .catch((saveError) => {
                        if (saveError.name === 'ValidationError') {
                            return res.status(400).json({ message: saveError.message });
                        } else {
                            return res.status(500).json({ message: 'Internal Server Error' });
                        }
                    });
            } else {
                return res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((findByIdError) => {
            return res.status(500).json({ message: 'Internal Server Error' });
        });
};

const deleteEvent = (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;

    return Event.findByIdAndDelete(eventId)
        .then((event) => (event ? res.status(201).json({ event, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const getNearbyEvents = (req: Request, res: Response, next: NextFunction) => {
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    const radius = req.query.radius;

    if (typeof longitude !== 'string' || typeof latitude !== 'string' || typeof radius !== 'string') {
        return res.status(400).json({ message: 'Parámetros inválidos' });
    }

    const locationPoint = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };

    Event.find({
        coordinates: {
            $nearSphere: {
                $geometry: locationPoint,
                $maxDistance: parseInt(radius)
            }
        }
    })
    .then(events => res.status(200).json(events))
    .catch(error => {
    console.error('Error al realizar consulta geoespacial:', error);
    return res.status(500).json({ error: error.message });
    });
};

export default { createEvent, readEvent, readAll, updateEvent, deleteEvent, getEventsUser, getNearbyEvents };
