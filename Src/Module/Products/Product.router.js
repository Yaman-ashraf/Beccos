import { Router } from 'express';
import * as productsControlelr from './Product.controller.js'
import fileUpload, { fileValidation } from '../../Services/multer.js';
import { auth } from '../../Midleware/Auth.js';
import endPoint from './Product.endpoint.js';
import reviewRouter from '../Review/Review.router.js'
const router = Router();
router.use('/:productId/review', reviewRouter);
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([
    { name: 'image', maxCount: 1 },
    { name: 'subImages', maxCount: 3 },
]), productsControlelr.createProduct);


router.post('/createWithExcel', auth(endPoint.create), fileUpload(fileValidation.excel).single('file'),
    productsControlelr.createProductWithExcel);
router.get('/active', productsControlelr.getActiveProducts);
router.get('/:id', productsControlelr.getProduct);
router.get('/', auth(endPoint.getAll), productsControlelr.getProducts);
router.put('/:productId', auth(endPoint.update), fileUpload(fileValidation.image).fields([
    { name: 'image', maxCount: 1 },
    { name: 'subImages', maxCount: 3 },
]), productsControlelr.updateProduct);
router.delete('/:productId', auth(endPoint.delete), productsControlelr.deleteProduct);


export default router;
