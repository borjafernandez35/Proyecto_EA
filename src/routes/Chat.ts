import express from 'express';
import controller from '../controllers/Chat';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.chat.create), controller.createChat);
router.get('/:chatId', controller.readChat);
router.get('/', controller.readAll);
router.put('/:chatId', ValidateSchema(Schemas.chat.update), controller.updateChat);
router.delete('/:chatId', controller.deleteChat);

export = router;
