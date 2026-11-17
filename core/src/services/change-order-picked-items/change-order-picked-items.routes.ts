import { Router } from 'express';
import { changeOrderPickedItemsController } from './change-order-picked-items.controller.js';

const router = Router();

router.patch('/picked/order', changeOrderPickedItemsController);

export default router;
