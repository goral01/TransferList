import { store } from '../../store.js';
import { isValid, isExist } from '../../validation.js';
import { AddItemQueue } from '../../queues/add-item.queue.js';

interface AddItemResult {
    id: number;
    picked: false;
}

const addItemQueue = new AddItemQueue<AddItemResult>();

const processAddItem = (id: number): AddItemResult => {
    if (isExist(id)) {
        console.log(id);
        throw new Error(`Element with id ${id} already exists`);
    }

    store.addedItems.add(id);

    return {
        id,
        picked: false,
    };
};

setInterval(() => {
    addItemQueue.processBatch(processAddItem);
}, 10_000);

export const addItem = (id: number): Promise<AddItemResult> => {
    if (!isValid(id)) {
        return Promise.reject(new Error('Invalid item ID'));
    }

    if (isExist(id)) {
        return Promise.reject(
            new Error(`Element with id ${id} already exists`),
        );
    }

    return addItemQueue.add(id);
};
