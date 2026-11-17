import type { ItemsResponse, ItemsPage, Item } from '../types';
import { API_URL } from '../constant';

export async function fetchItems(endpoint: string): Promise<ItemsPage> {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const data: ItemsResponse = await response.json();

        return {
            items: data.items.map((id) => ({ id })),
            nextCursor: data.nextCursor,
            hasMore: data.hasMore,
        };
    } catch (error) {
        console.error('FetchItems error:', error);
        throw error;
    }
}

export function getUnpickedItems(cursor = 0): Promise<ItemsPage> {
    return fetchItems(`/items/unpicked?cursor=${cursor}`);
}

export function getPickedItems(cursor = 0): Promise<ItemsPage> {
    return fetchItems(`/items/picked?cursor=${cursor}`);
}

export async function addItem(id: number): Promise<Item> {
    const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Не удалось добавить элемент');
    }

    return { id: data.id };
}
