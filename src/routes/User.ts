import express from 'express';
import controller from '../controllers/User';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';
import { verifyToken } from '../middleware/authJWT';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.user.create), controller.createUser);
router.get('/:userId', controller.readUser);
router.get('/', controller.readAll);
router.put('/:userId', [verifyToken], ValidateSchema(Schemas.user.update), controller.updateUser);
router.delete('/:userId', [verifyToken], controller.deleteUser);

export = router;
