import { store } from '../../store.js';
import { mutationQueue } from '../../queues/mutation.queue.js';

export const changeItemStatus = (id: number, picked: boolean) => {
    return mutationQueue.add(`status:${id}:${picked}`, () => {
        const currentStatus = store.pickedItems.has(id);

        if (currentStatus === picked) {
            return { id, picked };
        }

        if (picked) {
            store.pickedItems.add(id);
            store.orderPickedItems.push(id);
        } else {
            store.pickedItems.delete(id);

            const index = store.orderPickedItems.indexOf(id);

            if (index !== -1) {
                store.orderPickedItems.splice(index, 1);
            }
        }

        return { id, picked };
    });
};
