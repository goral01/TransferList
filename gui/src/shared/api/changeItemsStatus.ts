import { API_URL } from '../constant';

export async function changeItemStatus(
    id: number,
    picked: boolean,
): Promise<{ id: number; picked: boolean }> {
    const response = await fetch(`${API_URL}/items/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ picked }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to change item status');
    }

    return data;
}
