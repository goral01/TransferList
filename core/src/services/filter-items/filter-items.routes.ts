import { Router } from 'express';
import { filterItemsController } from './filter-items.controller.js';

const router = Router();

router.get('/', filterItemsController);

export default router;
