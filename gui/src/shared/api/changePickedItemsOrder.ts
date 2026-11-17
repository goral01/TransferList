import { API_URL } from '../constant';

export async function changePickedItemsOrder(
    orderedIds: number[],
    scopeIds: number[],
): Promise<{ order: number[] }> {
    const response = await fetch(`${API_URL}/items/picked/order`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderedIds, scopeIds }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to change items order');
    }

    return data;
}
