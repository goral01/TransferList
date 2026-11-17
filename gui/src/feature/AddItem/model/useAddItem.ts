import { useCallback } from 'react';

import { addItem } from '../../../shared/api';
import type { Item } from '../../../shared/types';

interface Props {
    setUnpickedItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

export function useAddItem({ setUnpickedItems }: Props) {
    const handleAddItem = useCallback(
        async (id: number) => {
            const item = await addItem(id);

            setUnpickedItems((prev) =>
                prev.some((current) => current.id === item.id)
                    ? prev
                    : [...prev, item].sort((a, b) => a.id - b.id),
            );
        },
        [setUnpickedItems],
    );

    return { handleAddItem };
}
