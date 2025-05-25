import express from 'express';
import authController from '../controllers/auth.controller';

const router = express.Router();
const asyncHandler = (fn: any) => (req: express.Request, res: express.Response, next: express.NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/auth/register', authController.register);
router.post('/auth/login', asyncHandler(authController.login));

export default router;
