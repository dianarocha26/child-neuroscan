interface QueuedOperation {
  id: string;
  type: 'insert' | 'update' | 'delete';
  table: string;
  data: unknown;
  timestamp: number;
}

const QUEUE_KEY = 'offline_queue';

class OfflineQueue {
  private getQueue(): QueuedOperation[] {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: QueuedOperation[]): void {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  add(operation: Omit<QueuedOperation, 'id' | 'timestamp'>): void {
    const queue = this.getQueue();
    const newOperation: QueuedOperation = {
      ...operation,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    queue.push(newOperation);
    this.saveQueue(queue);
  }

  getAll(): QueuedOperation[] {
    return this.getQueue();
  }

  remove(id: string): void {
    const queue = this.getQueue();
    const filtered = queue.filter(op => op.id !== id);
    this.saveQueue(filtered);
  }

  clear(): void {
    localStorage.removeItem(QUEUE_KEY);
  }

  size(): number {
    return this.getQueue().length;
  }
}

export const offlineQueue = new OfflineQueue();

export async function processOfflineQueue(
  processor: (operation: QueuedOperation) => Promise<boolean>
): Promise<{ processed: number; failed: number }> {
  const queue = offlineQueue.getAll();
  let processed = 0;
  let failed = 0;

  for (const operation of queue) {
    try {
      const success = await processor(operation);
      if (success) {
        offlineQueue.remove(operation.id);
        processed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error('Failed to process queued operation:', error);
      failed++;
    }
  }

  return { processed, failed };
}
