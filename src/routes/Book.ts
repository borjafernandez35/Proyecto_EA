import express from 'express';
import controller from '../controllers/Book';

const router = express.Router();

router.post('/create', controller.createBook);
router.get('/get/:bookId', controller.readBook);
router.get('/get/', controller.readAll);
router.patch('/update/:bookId', controller.updateBook);
router.delete('/delete/:bookId', controller.deleteBook);

export = router;
