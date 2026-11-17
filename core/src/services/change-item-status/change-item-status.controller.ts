import { Request, Response, NextFunction } from 'express';
import { changeItemStatus } from './change-item-status.service.js';

export const changeItemStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const { picked } = req.body;

        const result = await changeItemStatus(id, picked);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
