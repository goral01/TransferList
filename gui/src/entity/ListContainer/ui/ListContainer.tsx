import { useEffect, useRef } from "react";
import {
    TextField,
    Typography,
    CircularProgress,
    Button,
} from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";

import { SortableItem } from "../../SortibleItem";
import { useFilterItems } from "../model/useFilterItems";
import { useAddItemForm } from "../model/useAddItemForm";
import type { Item } from "../../../shared/types";

import { ItemContainer } from "../../ItemContainer";

import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type ListType = "picked" | "unpicked";

interface ListContainerProps {
    title: string;
    items: Item[];
    list: ListType;
    onLoadMore: () => void;
    hasMore: boolean;
    loadingMore: boolean;
    onAddItem?: (id: number) => void;
    onRemoveItem?: (id: number) => void;
    onCreateItem?: (id: number) => Promise<void>;
}

export function ListContainer({
    title,
    items,
    list,
    onLoadMore,
    hasMore,
    loadingMore,
    onAddItem,
    onRemoveItem,
    onCreateItem,
}: ListContainerProps) {

    const {
        isAdding,
        setIsAdding,
        newId,
        setNewId,
        adding,
        addError,
        setAddError,
        handleAddItem,
    } = useAddItemForm({ items, onCreateItem });

    const {
        filter,
        setFilter,
        filteredItems,
    } = useFilterItems(items);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: filteredItems.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: () => 80,
        overscan: 5,
        getItemKey: (index) => filteredItems[index].id,
    });

    useEffect(() => {
        const sentinel = sentinelRef.current;
        const scrollContainer = scrollContainerRef.current;

        if (!sentinel || !scrollContainer || !hasMore || loadingMore) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onLoadMore();
                }
            },
            {
                root: scrollContainer,
                threshold: 0,
            },
        );

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [onLoadMore, hasMore, loadingMore]);

    return (
        <section
            className={`
                flex-1 min-w-0 flex flex-col
                bg-[#292F39] rounded-xl p-4 overflow-hidden
            `}
        >
            <header className="mb-4">
                <div className="flex items-center justify-between gap-2">
                    <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 800 }}>
                        {title}
                    </Typography>

                    {list === "unpicked" && (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                setIsAdding((prev) => !prev);
                                setAddError("");
                            }}
                        >
                            + Add ID
                        </Button>
                    )}
                </div>

                <Typography variant="body2" sx={{ color: "#62676f" }}>
                    Loaded elements: {items.length}
                </Typography>

                {list === "unpicked" && isAdding && (
                    <div className="mt-3 flex gap-2">
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            placeholder="Enter new ID"
                            value={newId}
                            onChange={(event) => setNewId(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !adding) {
                                    handleAddItem();
                                }
                            }}
                            sx={{
                                input: {
                                    color: "#ffffff",
                                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                        margin: 0,
                                    },
                                    "&[type=number]": {
                                        MozAppearance: "textfield",
                                    },
                                },
                            }}
                        />

                        <Button
                            variant="contained"
                            disabled={adding || !newId.trim()}
                            onClick={handleAddItem}
                        >
                            {adding ? "..." : "Add"}
                        </Button>
                    </div>
                )}

                {addError && (
                    <Typography color="error" variant="caption">
                        {addError}
                    </Typography>
                )}
            </header>

            <TextField
                fullWidth
                size="small"
                placeholder="Filter by ID..."
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                sx={{
                    mb: 2,
                    input: { color: "#ffffff" },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#454c58" },
                        "&:hover fieldset": { borderColor: "#777f8e" },
                    },
                }}
            />
            <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto">
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: "100%",
                        position: "relative",
                    }}
                >
                    {list === "picked" ? (
                        <SortableContext
                            items={filteredItems.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                                const item = filteredItems[virtualItem.index];

                                return (
                                    <div
                                        key={virtualItem.key}
                                        ref={rowVirtualizer.measureElement}
                                        data-index={virtualItem.index}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            transform: `translateY(${virtualItem.start}px)`,
                                            paddingBottom: "12px",
                                        }}
                                    >
                                        <SortableItem item={item} onRemove={onRemoveItem} />
                                    </div>
                                );
                            })}
                        </SortableContext>
                    ) : (
                        rowVirtualizer.getVirtualItems().map((virtualItem) => {
                            const item = filteredItems[virtualItem.index];

                            return (
                                <div
                                    key={virtualItem.key}
                                    ref={rowVirtualizer.measureElement}
                                    data-index={virtualItem.index}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        transform: `translateY(${virtualItem.start}px)`,
                                        paddingBottom: "12px",
                                    }}
                                >
                                    <ItemContainer
                                        id={String(item.id)}
                                        action={
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => onAddItem?.(item.id)}
                                            >
                                                Pick
                                            </Button>
                                        }
                                    >
                                        <Typography variant="body1" sx={{ color: "#00256f" }}>
                                            Element with id {item.id}
                                        </Typography>
                                    </ItemContainer>
                                </div>
                            );
                        })
                    )}
                </div>

                {hasMore && (
                    <div ref={sentinelRef} className="flex justify-center py-3">
                        {loadingMore && <CircularProgress size={24} />}
                    </div>
                )}
            </div>
        </section>
    );
}
