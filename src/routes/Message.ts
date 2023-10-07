import express from 'express';
import controller from '../controllers/Message';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.message.create), controller.createMessage);
router.get('/:messageId', controller.readMessage);
router.get('/', controller.readAll);
router.put('/:messageId', ValidateSchema(Schemas.message.update), controller.updateMessage);
router.delete('/:messageId', controller.deleteMessage);

export = router;
