import { store } from '../../store.js';
import { ITEMS_LIMIT } from '../../constants.js';
import { readQueue } from '../../queues/read.queue.js';

interface Params {
    cursor?: number;
}

export const getPickedItems = ({ cursor = 0 }: Params) => {
    return readQueue.add(`picked:${cursor}`, () => {
        const items = store.orderPickedItems.slice(
            cursor,
            cursor + ITEMS_LIMIT,
        );

        const nextCursor = cursor + items.length;
        const hasMore = nextCursor < store.orderPickedItems.length;

        return {
            items,
            nextCursor: hasMore ? nextCursor : null,
            hasMore,
        };
    });
};
