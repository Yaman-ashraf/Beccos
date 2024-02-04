import { Router } from 'express';
import { auth } from '../../Midleware/Auth.js';
import endPoint from './Review.endpoint.js';
import * as reviewController from './Review.controller.js';
import fileUpload, { fileValidation } from '../../Services/multer.js';
const router = Router({ mergeParams: true });

router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).single('image'), reviewController.create);
router.get('/', reviewController.all);
export default router;

