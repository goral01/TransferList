import { DndContext, closestCenter } from '@dnd-kit/core';

import { useLoadItems } from '../model/useLoadItems';
import { ListContainer } from '../../../entity/ListContainer';

import { useChangeItemStatus } from '../../../feature/ChangeItemStatus';
import { useAddItem } from '../../../feature/AddItem';
import { useChangePickedItemsOrder } from '../../../feature/ChangePickedItemsOrder';

export function TransferList() {
    const {
        unpickedItems,
        pickedItems,
        setUnpickedItems,
        setPickedItems,
        loadMoreUnpicked,
        loadMorePicked,
        unpickedHasMore,
        pickedHasMore,
        loadingUnpicked,
        loadingPicked,
        loading,
        error,
        setPickedCursor,
    } = useLoadItems();

    const { updateItemStatus } = useChangeItemStatus({
        pickedHasMore,
        setUnpickedItems,
        setPickedItems,
        setPickedCursor,
    });

    const { handleAddItem } = useAddItem({
        setUnpickedItems,
    });

    const { handleDragEnd } = useChangePickedItemsOrder({
        pickedItems,
        setPickedItems,
    });

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#15181E] text-white">
                Loading...
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#15181E] text-red-400">
                {error}
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-[#15181E] p-4">
            <div className="w-full max-w-6xl h-[85vh] bg-[#20242C] rounded-2xl shadow-2xl border border-white/5 p-5 flex gap-5 overflow-hidden">
                <ListContainer
                    title="Unpicked"
                    list="unpicked"
                    items={unpickedItems}
                    onLoadMore={loadMoreUnpicked}
                    hasMore={unpickedHasMore}
                    loadingMore={loadingUnpicked}
                    onAddItem={(id) => updateItemStatus(id, true)}
                    onCreateItem={handleAddItem}
                />

                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <ListContainer
                        title="Picked"
                        list="picked"
                        items={pickedItems}
                        onLoadMore={loadMorePicked}
                        hasMore={pickedHasMore}
                        loadingMore={loadingPicked}
                        onRemoveItem={(id) => updateItemStatus(id, false)}
                    />
                </DndContext>
            </div>
        </main>
    );
}