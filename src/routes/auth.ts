import { Router } from 'express';
import { verifyToken } from '../middleware/authJWT';
import * as authCtrl from '../controllers/auth.controller';

const router = Router();
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
});

router.post('/signin', authCtrl.signin);
router.post('/signup', authCtrl.signup);
router.post('/me', authCtrl.me);

router.get('/private', [verifyToken], authCtrl.priv);
router.get('/public', [verifyToken], authCtrl.publ);

export default router;
