import { Router } from 'express';
import { getUnpickedItemsController } from './get-unpicked-items.controller.js';

const router = Router();

router.get('/', getUnpickedItemsController);

export default router;
