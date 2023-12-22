import express from 'express';
import controller from '../controllers/Event';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';
import { verifyToken } from '../middleware/authJWT';

const router = express.Router();

router.post('/', [verifyToken], ValidateSchema(Schemas.event.create), controller.createEvent);
router.get('/:eventId', controller.readEvent);
router.get('/user/:idUser', controller.getEventsUser);
router.get('/', controller.readAll);
router.put('/:eventId', [verifyToken], ValidateSchema(Schemas.event.update), controller.updateEvent);
router.delete('/:eventId', [verifyToken], controller.deleteEvent);

export = router;
