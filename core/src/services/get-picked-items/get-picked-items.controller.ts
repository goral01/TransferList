import { Request, Response, NextFunction } from 'express';
import { getPickedItems } from './get-picked-items.service.js';

export const getPickedItemsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const cursor = Number(req.query.cursor ?? 0);

        const result = await getPickedItems({ cursor });

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
