import { store } from './store.js';

export const isValid = (id: number): boolean => {
    return Number.isSafeInteger(id) && id > 0;
};

export const isExist = (id: number): boolean => {
    if (!isValid(id)) {
        return false;
    }

    return id <= store.totalItems || store.addedItems.has(id);
};

export const isPicked = (id: number): boolean => {
    return store.pickedItems.has(id);
};
