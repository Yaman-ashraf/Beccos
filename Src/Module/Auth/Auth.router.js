import {Router} from 'express';
import * as AuthController from './Auth.controller.js'
import fileUpload, { fileValidation } from '../../Services/multer.js';
const router = Router();

router.post('/signup',AuthController.signup)
router.post('/signin',AuthController.signin)
router.get('/:token',AuthController.confirmEmail)
router.patch('/sendCode',AuthController.sendCode);
router.patch('/forgotPassword',AuthController.forgotPassword);
export default router;


