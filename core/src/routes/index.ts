import { Router } from 'express';

import getPickedItemsRoutes from '../services/get-picked-items/get-picked-items.routes.js';
import getUnpickedItemsRoutes from '../services/get-unpicked-items/get-unpicked-items.routes.js';
import changeItemStatusRoutes from '../services/change-item-status/change-item-status.routes.js';
import changeOrderPickedItemsRoutes from '../services/change-order-picked-items/change-order-picked-items.routes.js';
import filterItemsRoutes from '../services/filter-items/filter-items.routes.js';
import addItemRoutes from '../services/add-item/add-item.routes.js';

const router = Router();

router.use('/items/picked', getPickedItemsRoutes);
router.use('/items/unpicked', getUnpickedItemsRoutes);
router.use('/items', changeItemStatusRoutes);
router.use('/items', changeOrderPickedItemsRoutes);
router.use('/items/filter', filterItemsRoutes);
router.use('/items', addItemRoutes);

export default router;
