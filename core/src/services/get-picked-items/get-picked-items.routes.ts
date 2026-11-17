import { Router } from 'express';
import { getPickedItemsController } from './get-picked-items.controller.js';

const router = Router();

router.get('/', getPickedItemsController);

export default router;
