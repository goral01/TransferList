import { Request, Response, NextFunction } from 'express';
import { getUnpickedItems } from './get-unpicked-items.service.js';

export const getUnpickedItemsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const cursor = Number(req.query.cursor ?? 0);

        const result = await getUnpickedItems({ cursor });

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
