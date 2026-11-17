import { useEffect, useState, useCallback, useRef } from 'react';

import { getUnpickedItems, getPickedItems } from '../../../shared/api';

import type { Item } from '../../../shared/types';

export function useLoadItems() {
    const [unpickedItems, setUnpickedItems] = useState<Item[]>([]);
    const [pickedItems, setPickedItems] = useState<Item[]>([]);

    const [unpickedCursor, setUnpickedCursor] = useState<number | null>(0);
    const [pickedCursor, setPickedCursor] = useState<number | null>(0);

    const [unpickedHasMore, setUnpickedHasMore] = useState(true);
    const [pickedHasMore, setPickedHasMore] = useState(true);

    const [loading, setLoading] = useState(true);
    const [loadingUnpicked, setLoadingUnpicked] = useState(false);
    const [loadingPicked, setLoadingPicked] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const unpickedLock = useRef(false);
    const pickedLock = useRef(false);

    useEffect(() => {
        const loadItems = async () => {
            try {
                console.log('Начинаем загрузку');

                const [unpicked, picked] = await Promise.all([
                    getUnpickedItems(),
                    getPickedItems(),
                ]);

                console.log('Оба списка загружены');

                setUnpickedItems(unpicked.items);
                setPickedItems(picked.items);

                setUnpickedCursor(unpicked.nextCursor);
                setPickedCursor(picked.nextCursor);

                setUnpickedHasMore(unpicked.hasMore);
                setPickedHasMore(picked.hasMore);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load items',
                );
            } finally {
                setLoading(false);
            }
        };

        loadItems();
    }, []);

    const loadMoreUnpicked = useCallback(async () => {
        if (unpickedLock.current || !unpickedHasMore || unpickedCursor === null)
            return;

        unpickedLock.current = true;
        setLoadingUnpicked(true);

        try {
            const data = await getUnpickedItems(unpickedCursor);

            setUnpickedItems((prev) => {
                const existingIds = new Set(prev.map((item) => item.id));

                const newItems = data.items.filter(
                    (item) => !existingIds.has(item.id),
                );

                return [...prev, ...newItems];
            });
            setUnpickedCursor(data.nextCursor);
            setUnpickedHasMore(data.hasMore);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Failed to load items',
            );
        } finally {
            unpickedLock.current = false;
            setLoadingUnpicked(false);
        }
    }, [unpickedCursor, unpickedHasMore]);

    const loadMorePicked = useCallback(async () => {
        if (pickedLock.current || !pickedHasMore || pickedCursor === null)
            return;

        pickedLock.current = true;
        setLoadingPicked(true);

        try {
            const data = await getPickedItems(pickedCursor);

            setPickedItems((prev) => [...prev, ...data.items]);
            setPickedCursor(data.nextCursor);
            setPickedHasMore(data.hasMore);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Failed to load items',
            );
        } finally {
            pickedLock.current = false;
            setLoadingPicked(false);
        }
    }, [pickedCursor, pickedHasMore]);

    return {
        unpickedItems,
        pickedItems,
        setUnpickedItems,
        setPickedItems,
        setPickedCursor,
        loadMoreUnpicked,
        loadMorePicked,
        unpickedHasMore,
        pickedHasMore,
        loading,
        loadingUnpicked,
        loadingPicked,
        error,
    };
}
