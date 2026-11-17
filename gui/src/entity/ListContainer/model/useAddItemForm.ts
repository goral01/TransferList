import { useState } from 'react';
import type { Item } from '../../../shared/types';

interface Props {
    items: Item[];
    onCreateItem?: (id: number) => Promise<void>;
}

export function useAddItemForm({ items, onCreateItem }: Props) {
    const [isAdding, setIsAdding] = useState(false);
    const [newId, setNewId] = useState('');
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState('');

    const handleAddItem = async () => {
        const id = Number(newId);

        if (!Number.isSafeInteger(id) || id <= 0) {
            setAddError('Введите корректный положительный ID');
            return;
        }

        if (items.some((item) => item.id === id)) {
            setAddError('Этот ID уже находится в списке');
            return;
        }

        if (!onCreateItem) return;

        setAdding(true);
        setAddError('');

        try {
            await onCreateItem(id);
            setNewId('');
            setIsAdding(false);
        } catch (error) {
            setAddError(
                error instanceof Error
                    ? error.message
                    : 'Не удалось добавить элемент',
            );
        } finally {
            setAdding(false);
        }
    };

    return {
        isAdding,
        setIsAdding,
        newId,
        setNewId,
        adding,
        addError,
        setAddError,
        handleAddItem,
    };
}
