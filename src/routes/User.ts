import express from 'express';
import controller from '../controllers/User';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.user.create), controller.createUser);
router.get('/:userId', controller.readUser);
router.get('/', controller.readAll);
router.put('/:userId', ValidateSchema(Schemas.user.update), controller.updateUser);
router.delete('/:authorId', controller.deleteUser);

export = router;
