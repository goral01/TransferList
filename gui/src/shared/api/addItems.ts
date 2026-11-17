import { API_URL } from '../constant';
import type { Item } from '../types';

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
        throw new Error(data.message || 'Failed to add item');
    }

    return { id: data.id };
}
