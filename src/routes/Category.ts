import express from 'express';
import controller from '../controllers/Category';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.category.create), controller.createCategory);
router.get('/:categoryId', controller.readCategory);
router.get('/', controller.readAll);
router.put('/:categoryId', ValidateSchema(Schemas.category.update), controller.updateCategory);
router.delete('/:categoryId', controller.deleteCategory);

export = router;
