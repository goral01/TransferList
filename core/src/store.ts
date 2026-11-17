import { TOTAL_ITEMS } from './constants.js';

const createStore = () => ({
    pickedItems: new Set<number>(),
    addedItems: new Set<number>(),
    orderPickedItems: [] as number[],

    totalItems: TOTAL_ITEMS,
});

export const store = createStore();
