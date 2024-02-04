import { Router } from 'express';
import endPoint from './User.endpoint.js';
import * as userController from './User.controller.js';
import { auth } from '../../Midleware/Auth.js';
const router = Router();

router.get('/', auth(endPoint.getUsers), userController.getUsers);
router.patch('/:userId', auth(endPoint.updateUser), userController.updateUser)
router.get('/getUserData', auth(endPoint.getUserData), userController.getUserData);
router.get('/:userId', userController.getUser);
router.post('/contact', userController.contact);

export default router;
