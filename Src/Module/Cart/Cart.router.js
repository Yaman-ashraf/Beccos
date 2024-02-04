import {Router} from 'express';
import { auth } from '../../Midleware/Auth.js';
import endPoint from './Cart.endpoint.js';
import * as cartController from './Cart.controller.js';
const router = Router();


router.post('/',auth(endPoint.addToCart),cartController.addToCart);

router.patch('/removeItem',auth(endPoint.removeItem),cartController.removeItem);
router.patch('/clearCart',auth(endPoint.removeItem),cartController.clearCart);
router.patch('/updateQuantity',auth(endPoint.updateQuantity),cartController.updateQuantity);
router.get('/',auth(endPoint.getCart),cartController.getCart)

export default router;
