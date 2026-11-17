import { store } from '../../store.js';
import { isValid } from '../../validation.js';
import { mutationQueue } from '../../queues/mutation.queue.js';

interface Params {
    orderedIds: number[];
    scopeIds: number[];
}

export const changeOrderPickedItems = ({ orderedIds, scopeIds }: Params) => {
    const key = `order:${JSON.stringify(orderedIds)}:${JSON.stringify(scopeIds)}`;

    return mutationQueue.add(key, () => {
        const orderedSet = new Set(orderedIds);
        const scopeSet = new Set(scopeIds);

        if (
            !Array.isArray(orderedIds) ||
            !Array.isArray(scopeIds) ||
            orderedIds.length !== scopeIds.length ||
            orderedSet.size !== orderedIds.length ||
            scopeSet.size !== scopeIds.length ||
            orderedIds.some((id) => !isValid(id) || !scopeSet.has(id))
        ) {
            throw new Error('Invalid order data');
        }

        if (
            scopeIds.some(
                (id) =>
                    !store.pickedItems.has(id) ||
                    !store.orderPickedItems.includes(id),
            )
        ) {
            throw new Error('Some items are not picked');
        }

        const positions: number[] = [];

        store.orderPickedItems.forEach((id, index) => {
            if (scopeSet.has(id)) {
                positions.push(index);
            }
        });

        positions.forEach((position, index) => {
            store.orderPickedItems[position] = orderedIds[index];
        });

        return {
            order: [...store.orderPickedItems],
        };
    });
};
