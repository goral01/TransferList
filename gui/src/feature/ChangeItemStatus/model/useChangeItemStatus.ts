import { useCallback } from 'react';

import { changeItemStatus } from '../../../shared/api';
import type { Item } from '../../../shared/types';

interface Props {
    pickedHasMore: boolean;
    setUnpickedItems: React.Dispatch<React.SetStateAction<Item[]>>;
    setPickedItems: React.Dispatch<React.SetStateAction<Item[]>>;
    setPickedCursor: React.Dispatch<React.SetStateAction<number | null>>;
}

export function useChangeItemStatus({
    pickedHasMore,
    setUnpickedItems,
    setPickedItems,
    setPickedCursor,
}: Props) {
    const updateItemStatus = useCallback(
        async (id: number, picked: boolean) => {
            await changeItemStatus(id, picked);

            if (picked) {
                setUnpickedItems((prev) =>
                    prev.filter((item) => item.id !== id),
                );

                if (!pickedHasMore) {
                    setPickedItems((prev) =>
                        prev.some((item) => item.id === id)
                            ? prev
                            : [...prev, { id }],
                    );
                }
            } else {
                setPickedItems((prev) => {
                    const wasLoaded = prev.some((item) => item.id === id);

                    if (wasLoaded) {
                        setPickedCursor((cursor) =>
                            cursor === null ? null : Math.max(0, cursor - 1),
                        );
                    }

                    return prev.filter((item) => item.id !== id);
                });

                setUnpickedItems((prev) =>
                    prev.some((item) => item.id === id)
                        ? prev
                        : [...prev, { id }].sort((a, b) => a.id - b.id),
                );
            }
        },
        [pickedHasMore, setUnpickedItems, setPickedItems, setPickedCursor],
    );

    return { updateItemStatus };
}
