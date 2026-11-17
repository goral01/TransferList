import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    console.error(error);

    if (error.message.includes('already exists')) {
        res.status(409).json({
            message: error.message,
        });
        return;
    }

    if (error.message.includes('Invalid item ID')) {
        res.status(400).json({
            message: error.message,
        });
        return;
    }

    res.status(500).json({
        message: 'Internal server error',
    });
};
