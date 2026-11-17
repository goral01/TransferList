import { Request, Response, NextFunction } from 'express';
import { addItem } from './add-item.service.js';

export const addItemController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { id } = req.body;

        const result = await addItem(id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
