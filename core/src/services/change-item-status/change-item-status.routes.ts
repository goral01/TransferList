import { Router } from 'express';
import { changeItemStatusController } from './change-item-status.controller.js';

const router = Router();

router.patch('/:id/status', changeItemStatusController);

export default router;
