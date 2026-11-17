import { Request, Response, NextFunction } from 'express';
import { changeOrderPickedItems } from './change-order-picked-items.service.js';

export const changeOrderPickedItemsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { orderedIds, scopeIds } = req.body;

        const result = await changeOrderPickedItems({
            orderedIds,
            scopeIds,
        });

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
