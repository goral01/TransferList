interface QueueEntry<T> {
    resolve: (result: T) => void;
    reject: (error: Error) => void;
}

export class AddItemQueue<T> {
    private queue = new Map<number, QueueEntry<T>>();

    add(id: number): Promise<T> {
        if (this.queue.has(id)) {
            return Promise.reject(
                new Error(
                    `Item with id ${id} already exists or is being added`,
                ),
            );
        }

        return new Promise((resolve, reject) => {
            this.queue.set(id, { resolve, reject });
        });
    }

    processBatch(process: (id: number) => T): void {
        const batch = [...this.queue.entries()];
        this.queue.clear();

        for (const [id, entry] of batch) {
            try {
                const result = process(id);
                entry.resolve(result);
            } catch (error) {
                entry.reject(
                    error instanceof Error
                        ? error
                        : new Error('Batch processing failed'),
                );
            }
        }
    }

    has(id: number): boolean {
        return this.queue.has(id);
    }
}
