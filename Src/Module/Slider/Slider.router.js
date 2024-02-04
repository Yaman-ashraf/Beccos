import { Router } from 'express';
import * as SliderController from './Slider.controller.js';
import { auth } from '../../Midleware/Auth.js';
import endPoint from './Slider.endpoint.js';
import fileUpload, { fileValidation } from '../../Services/multer.js';
const router = Router();


router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).single('image'), SliderController.createSlider);
router.get('/', auth(endPoint.getAll), SliderController.getAllSlider);
router.get('/active', SliderController.getActiveSlider);
router.put('/:imageId', auth(endPoint.update), fileUpload(fileValidation.image).single('image'),
    SliderController.updateSlider);
router.delete('/:imageId', auth(endPoint.delete), SliderController.deleteSlider);
router.get('/:id', SliderController.getSlider);
export default router;
