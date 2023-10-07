import express from 'express';
import controller from '../controllers/Comment';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.comment.create), controller.createComment);
router.get('/:commentId', controller.readComment);
router.get('/', controller.readAll);
router.put('/:commentId', ValidateSchema(Schemas.comment.update), controller.updateComment);
router.delete('/:commentId', controller.deleteComment);

export = router;
