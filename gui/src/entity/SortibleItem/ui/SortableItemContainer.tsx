import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Typography, Button } from "@mui/material";

import { ItemContainer } from "../../ItemContainer";
import type { Item } from "../../../shared/types";

interface SortableItemProps {
    item: Item;
    onRemove?: (id: number) => void;
}

export function SortableItem({ item, onRemove }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
    });

    return (
        <div ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
                touchAction: "none",
            }}
            {...attributes}
            {...listeners}>
            <ItemContainer
                id={String(item.id)}
                action={
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                            event.stopPropagation();
                            onRemove?.(item.id);
                        }}
                    >
                        Unpick
                    </Button>
                }
            >
                <Typography variant="body1" sx={{ color: "#00256f" }}>
                    Element with id {item.id}
                </Typography>
            </ItemContainer>
        </div>
    );
}
