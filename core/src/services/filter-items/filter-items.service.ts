import { store } from '../../store.js';
import { ITEMS_LIMIT } from '../../constants.js';
import { readQueue } from '../../queues/read.queue.js';

type ItemListType = 'picked' | 'unpicked';

interface Params {
    query: string;
    list: ItemListType;
    cursor?: number;
}

export const filterItems = async ({ query, list, cursor = 0 }: Params) => {
    return readQueue.add(`filter:${list}:${query.trim()}:${cursor}`, () => {
        const items: number[] = [];
        const normalizedQuery = query.trim();

        const matches = (id: number) => id.toString().includes(normalizedQuery);

        if (list === 'picked') {
            let nextCursor: number | null = null;

            for (
                let index = cursor;
                index < store.orderPickedItems.length;
                index++
            ) {
                const id = store.orderPickedItems[index];

                if (!matches(id)) continue;

                if (items.length === ITEMS_LIMIT) {
                    nextCursor = index;
                    break;
                }

                items.push(id);
            }

            return {
                items,
                nextCursor,
                hasMore: nextCursor !== null,
            };
        }

        let lastId = cursor;
        let hasMore = false;

        for (let id = cursor + 1; id <= store.totalItems; id++) {
            lastId = id;

            if (store.pickedItems.has(id) || !matches(id)) {
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
                if (id <= lastId || store.pickedItems.has(id) || !matches(id)) {
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
