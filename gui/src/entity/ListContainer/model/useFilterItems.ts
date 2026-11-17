import { useMemo, useState } from 'react';
import type { Item } from '../../../shared/types';

export function useFilterItems(items: Item[]) {
    const [filter, setFilter] = useState('');

    const filteredItems = useMemo(() => {
        const normalizedFilter = filter.trim();

        if (!normalizedFilter) return items;

        return items.filter((item) =>
            String(item.id).includes(normalizedFilter),
        );
    }, [items, filter]);

    return { filter, setFilter, filteredItems };
}
