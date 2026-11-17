interface QueueEntry<T> {
    process: () => T;
    resolve: (result: T) => void;
    reject: (error: Error) => void;
}

interface DeduplicatedEntry<T> {
    process: () => T;
    resolvers: Array<(result: T) => void>;
    rejecters: Array<(error: Error) => void>;
}

export class ReadQueue {
    private queue = new Map<string, DeduplicatedEntry<unknown>>();

    add<T>(key: string, process: () => T): Promise<T> {
        return new Promise((resolve, reject) => {
            const existing = this.queue.get(key);

            if (existing) {
                existing.resolvers.push(resolve as (result: unknown) => void);
                existing.rejecters.push(reject);
                return;
            }

            this.queue.set(key, {
                process,
                resolvers: [resolve as (result: unknown) => void],
                rejecters: [reject],
            });
        });
    }

    processBatch(): void {
        const batch = this.queue;
        this.queue = new Map();

        for (const entry of batch.values()) {
            try {
                const result = entry.process();

                entry.resolvers.forEach((resolve) => resolve(result));
            } catch (error) {
                const normalizedError =
                    error instanceof Error
                        ? error
                        : new Error('Read operation failed');

                entry.rejecters.forEach((reject) => reject(normalizedError));
            }
        }
    }
}

export const readQueue = new ReadQueue();

setInterval(() => {
    readQueue.processBatch();
}, 1_000);
