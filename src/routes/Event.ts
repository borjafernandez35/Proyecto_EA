import express from 'express';
import controller from '../controllers/Event';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.event.create), controller.createEvent);
router.get('/:eventId', controller.readEvent);
router.get('/user/:idUser', controller.getEventsUser);
router.get('/', controller.readAll);
router.put('/:eventId', ValidateSchema(Schemas.event.update), controller.updateEvent);
router.delete('/:eventId', controller.deleteEvent);
router.get('/nearby', controller.getNearbyEvents);// nueva ruta de busqueda geoespacial

export = router;