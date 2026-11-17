export interface Item {
    id: number;
}

export interface ItemsResponse {
    items: number[];
    nextCursor: number | null;
    hasMore: boolean;
}

export interface ItemsPage {
    items: Item[];
    nextCursor: number | null;
    hasMore: boolean;
}

export interface SortableItemProps {
    item: Item;
    onRemove?: (id: number) => void;
}
