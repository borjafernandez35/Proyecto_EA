import express from 'express';
import controller from '../controllers/User';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.author.create), controller.createUser);
router.get('/:authorId', controller.readUser);
router.get('/', controller.readAll);
router.put('/:authorId', ValidateSchema(Schemas.author.update), controller.updateUser);
router.delete('/:authorId', controller.deleteUser);

export = router;
