import express from 'express';
import controller from '../controllers/Comment';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';
import { verifyToken } from '../middleware/authJWT';

const router = express.Router();

router.post('/', [verifyToken], ValidateSchema(Schemas.comment.create), controller.createComment);
router.get('/:commentId', controller.readComment);
router.get('/', controller.readAll);
router.put('/:commentId', [verifyToken], ValidateSchema(Schemas.comment.update), controller.updateComment);
router.delete('/:commentId', [verifyToken], controller.deleteComment);

export = router;
