import { store } from '../../store.js';
import { ITEMS_LIMIT } from '../../constants.js';
import { readQueue } from '../../queues/read.queue.js';

interface Params {
    cursor?: number;
}

export const getUnpickedItems = ({ cursor = 0 }: Params) => {
    return readQueue.add(`unpicked:${cursor}`, () => {
        const items: number[] = [];
        let lastId = cursor;
        let hasMore = false;

        for (let id = cursor + 1; id <= store.totalItems; id++) {
            lastId = id;

            if (store.pickedItems.has(id)) {
                continue;
            }

            if (items.length === ITEMS_LIMIT) {
                hasMore = true;
                lastId = id - 1;
                break;
            }

            items.push(id);
        }

        if (!hasMore && lastId >= store.totalItems) {
            const addedItems = [...store.addedItems].sort((a, b) => a - b);

            for (const id of addedItems) {
                if (id <= lastId || store.pickedItems.has(id)) {
                    continue;
                }

                if (items.length === ITEMS_LIMIT) {
                    hasMore = true;
                    lastId = id - 1;
                    break;
                }

                items.push(id);
                lastId = id;
            }
        }

        return {
            items,
            nextCursor: hasMore ? lastId : null,
            hasMore,
        };
    });
};
