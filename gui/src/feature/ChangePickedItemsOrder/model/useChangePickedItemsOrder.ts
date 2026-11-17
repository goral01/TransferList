import { useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';

import { changePickedItemsOrder } from '../../../shared/api';
import type { Item } from '../../../shared/types';

interface Props {
    pickedItems: Item[];
    setPickedItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

export function useChangePickedItemsOrder({
    pickedItems,
    setPickedItems,
}: Props) {
    const handleDragEnd = useCallback(
        async ({ active, over }: DragEndEvent) => {
            if (!over || active.id === over.id) return;

            const oldIndex = pickedItems.findIndex(
                (item) => item.id === Number(active.id),
            );

            const newIndex = pickedItems.findIndex(
                (item) => item.id === Number(over.id),
            );

            if (oldIndex === -1 || newIndex === -1) return;

            const nextItems = arrayMove(pickedItems, oldIndex, newIndex);

            try {
                await changePickedItemsOrder(
                    nextItems.map((item) => item.id),
                    pickedItems.map((item) => item.id),
                );

                setPickedItems(nextItems);
            } catch (error) {
                console.error('Ошибка изменения порядка:', error);
            }
        },
        [pickedItems, setPickedItems],
    );

    return { handleDragEnd };
}
