/**
 * LRU Cache implementation for template caching
 */

interface LRUNode<T> {
  value: T;
  next?: LRUNode<T>;
  prev?: LRUNode<T>;
}

export class LRUCache<T> {
  private cache = new Map<string, LRUNode<T>>();
  private head?: LRUNode<T>;
  private tail?: LRUNode<T>;
  private currentSize = 0;

  constructor(private maxSize: number) {}

  get(key: string): T | undefined {
    const node = this.cache.get(key);
    if (!node) return undefined;
    this.moveToFront(node);
    return node.value;
  }

  set(key: string, value: T): void {
    const existing = this.cache.get(key);
    if (existing) {
      existing.value = value;
      this.moveToFront(existing);
      return;
    }

    const node: LRUNode<T> = { value };
    this.cache.set(key, node);
    this.addToFront(node);
    this.currentSize++;

    if (this.currentSize > this.maxSize) {
      this.removeLast();
    }
  }

  private addToFront(node: LRUNode<T>): void {
    node.next = this.head;
    node.prev = undefined;
    if (this.head) {
      this.head.prev = node;
    }
    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
  }

  private moveToFront(node: LRUNode<T>): void {
    if (node === this.head) return;

    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
    if (node === this.tail) {
      this.tail = node.prev;
    }

    this.addToFront(node);
  }

  private removeLast(): void {
    if (!this.tail) return;

    this.cache.delete(this.tail.value as unknown as string);
    if (this.tail.prev) {
      this.tail.prev.next = undefined;
    }
    this.tail = this.tail.prev;
    this.currentSize--;
  }

  clear(): void {
    this.cache.clear();
    this.head = undefined;
    this.tail = undefined;
    this.currentSize = 0;
  }

  get size(): number {
    return this.currentSize;
  }
}
