import { Router } from 'express';
import * as categoriesControlelr from './Categories.controller.js'
import fileUpload, { fileValidation } from '../../Services/multer.js';
import { auth } from '../../Midleware/Auth.js';
import endPoint from './Categories.endpoint.js';
const router = Router();



router.post('/', auth(['Admin', 'super_Admin']), categoriesControlelr.createCategory)
router.get('/', categoriesControlelr.getCategories);
router.get('/active', categoriesControlelr.getActiveCategories);

router.get('/:id', categoriesControlelr.getCategory);
router.delete('/:id', auth(endPoint.delete), categoriesControlelr.deleteCategory);
router.patch('/:id', auth(endPoint.update), categoriesControlelr.updateCategory);
router.get('/similerProduct/:categoryId/:productId', categoriesControlelr.getSimilerProduct);

export default router;


