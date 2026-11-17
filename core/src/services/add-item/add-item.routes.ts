import { Router } from 'express';
import { addItemController } from './add-item.controller.js';

const router = Router();

router.post('/', addItemController);

export default router;
