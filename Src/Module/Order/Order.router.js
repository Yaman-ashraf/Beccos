import {Router} from 'express';
import { auth } from '../../Midleware/Auth.js';
import * as orderController from './Order.controller.js';
import endPoint from './Order.endpoint.js';
const router =Router();

router.post('/',auth(endPoint.create),orderController.create);
router.get('/',auth(endPoint.getUserOrder),orderController.getUserOrder);
router.patch('/cancel/:id',auth(endPoint.cancel),orderController.cancelOrder);
router.patch('/changeStatus/:orderId',auth(endPoint.changeStatus),orderController.changeStatus);
router.get('/allOrder',auth(endPoint.allOrder),orderController.allOrder);
router.get('/details/:orderId',auth(endPoint.details),orderController.getDetails);
router.patch('/updateShipping/:orderId',auth(endPoint.updateShipping),orderController.updateShipping);
router.get('/getSellingProduct',auth(endPoint.reports),orderController.getTopSellingProducts);
router.get('/getUsersOrdersReport',auth(endPoint.reports),orderController.getUsersOrdersReport);




export default router;
