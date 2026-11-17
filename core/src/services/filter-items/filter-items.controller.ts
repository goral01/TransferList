import { Request, Response, NextFunction } from 'express';
import { filterItems } from './filter-items.service.js';

export const filterItemsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const query = req.query.query;
        const list = req.query.list;
        const cursor = Number(req.query.cursor ?? 0);

        if (
            typeof query !== 'string' ||
            typeof list !== 'string' ||
            !['picked', 'unpicked'].includes(list)
        ) {
            throw new Error('Invalid query parameters');
        }

        const result = await filterItems({
            query,
            list: list as 'picked' | 'unpicked',
            cursor,
        });

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
