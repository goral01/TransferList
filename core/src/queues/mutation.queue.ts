interface QueueEntry<T> {
    key: string;
    process: () => T;
    resolvers: Array<(result: T) => void>;
    rejecters: Array<(error: Error) => void>;
}

export class MutationQueue {
    private queue: QueueEntry<unknown>[] = [];

    add<T>(key: string, process: () => T): Promise<T> {
        return new Promise((resolve, reject) => {
            const lastEntry = this.queue[this.queue.length - 1];

            if (lastEntry?.key === key) {
                lastEntry.resolvers.push(resolve as (result: unknown) => void);
                lastEntry.rejecters.push(reject);
                return;
            }

            this.queue.push({
                key,
                process,
                resolvers: [resolve as (result: unknown) => void],
                rejecters: [reject],
            });
        });
    }

    processBatch(): void {
        const batch = this.queue;
        this.queue = [];

        for (const entry of batch) {
            try {
                const result = entry.process();

                entry.resolvers.forEach((resolve) => resolve(result));
            } catch (error) {
                const normalizedError =
                    error instanceof Error
                        ? error
                        : new Error('Mutation operation failed');

                entry.rejecters.forEach((reject) => reject(normalizedError));
            }
        }
    }
}

export const mutationQueue = new MutationQueue();

setInterval(() => {
    mutationQueue.processBatch();
}, 1_000);
