class DoublyLinkedNode<K, V> {
  key: K;
  value: V;
  prev: DoublyLinkedNode<K, V> | null = null;
  next: DoublyLinkedNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

class AsyncLRUCache<K, V> {
  private maxSize: number;
  private cache: Map<K, DoublyLinkedNode<K, V>>;
  private head: DoublyLinkedNode<K, V> | null = null;
  private tail: DoublyLinkedNode<K, V> | null = null;
  private currentSize: number = 0;

  constructor(maxSize: number = 10000) {
  if (!Number.isInteger(maxSize) || maxSize <= 0) {
    throw new Error("maxSize must be a positive integer greater than 0");
  }

  this.maxSize = maxSize;
  this.cache = new Map();
  this.currentSize = 0; // Initialize size tracker
  }

  private moveToHead(node: DoublyLinkedNode<K, V>): void {
    if (node === this.head) return;

    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.tail) this.tail = node.prev;

    node.prev = null;
    node.next = this.head;
    if (this.head) this.head.prev = node;
    this.head = node;

    if (!this.tail) this.tail = node;
  }

  private removeTail(): DoublyLinkedNode<K, V> | null {
  if (!this.tail) return null;

  const tailNode = this.tail;
  if (tailNode.prev) {
    tailNode.prev.next = null; // Update the previous node's next reference
  } else {
    this.head = null; // If there's no previous node, update the head
  }
  this.tail = tailNode.prev; // Update the tail reference

  console.log(`Removed tail node with key: ${tailNode.key}`);
  return tailNode;
  }
  
  async get(key: K): Promise<V | undefined> {
    if (key === null || key === undefined) {
      throw new Error("Key must not be null or undefined");
    }

    const node = this.cache.get(key);
    if (!node) {
      return undefined;
    }

    this.moveToHead(node);
    return node.value;
  }

  async set(key: K, value: V): Promise<void> {
  if (key === null || key === undefined) {
    throw new Error("Key must not be null or undefined");
  }

  const existingNode = this.cache.get(key);

  if (existingNode) {
    existingNode.value = value;
    this.moveToHead(existingNode);
  } else {
    const newNode = new DoublyLinkedNode(key, value);
    this.cache.set(key, newNode);
    this.moveToHead(newNode);
    this.currentSize++; // Increment size

    if (this.currentSize > this.maxSize) {
      const evictCount = Math.ceil(this.maxSize * 0.1);
      console.log(`Evicting ${evictCount} items from cache...`);

      let evicted = 0;
      while (this.currentSize > this.maxSize && evicted < evictCount) {
        const tailNode = this.removeTail();
        if (tailNode && this.cache.delete(tailNode.key)) {
          this.currentSize--; // Decrement size
          evicted++;
          console.log(`Evicted key: ${tailNode.key}. Current size: ${this.currentSize}`);
        }
      }
    }
  }
  }
  

  async setMaxKeys(newMaxSize: number): Promise<void> {
  if (!Number.isFinite(newMaxSize) || newMaxSize <= 0) {
    throw new Error("newMaxSize must be a positive number greater than 0");
  }

  this.maxSize = Math.round(newMaxSize / 10) * 10;

  console.log(`maxSize updated to: ${this.maxSize}`);

  // Evict excess nodes
  while (this.cache.size > this.maxSize) {
    const tailNode = this.removeTail();
    if (tailNode) {
      const deleted = await this.delete(tailNode.key);
      console.log(`Deleted tail key: ${tailNode.key}. Current size: ${this.cache.size}`);
      if (!deleted) console.error(`Failed to delete key: ${tailNode.key}`);
    }
  }
  }

  async delete(key: K): Promise<boolean> {
  if (key === null || key === undefined) {
    throw new Error("Key must not be null or undefined");
  }

  const node = this.cache.get(key);
  if (!node) return false;

  if (node.prev) node.prev.next = node.next;
  if (node.next) node.next.prev = node.prev;

  if (node === this.head) this.head = node.next;
  if (node === this.tail) this.tail = node.prev;
  if (node === this.head && node === this.tail) {
    this.head = null;
    this.tail = null;
  }

  const deleted = this.cache.delete(key);
  if (deleted) this.currentSize--; // Decrement size on successful deletion
  console.log(`Deleted key: ${key}. Current size: ${this.currentSize}`);
  return deleted;
  }
  

  async clear(): Promise<void> {
  this.cache.clear();
  this.head = null;
  this.tail = null;
  this.currentSize = 0; // Reset size tracker
  console.log("Cache cleared. Current size:", this.currentSize);
  }

  async has(key: K): Promise<boolean> {
    if (key === null || key === undefined) {
      throw new Error("Key must not be null or undefined");
    }

    return this.cache.has(key);
  }

  async size(): Promise<number> {
    return this.cache.size;
  }

  async *keys(): AsyncIterableIterator<K> {
    for (let current = this.head; current !== null; current = current.next) {
      yield current.key;
    }
  }

  async *values(): AsyncIterableIterator<V> {
    for (let current = this.head; current !== null; current = current.next) {
      yield current.value;
    }
  }

  async *entries(): AsyncIterableIterator<[K, V]> {
    for (let current = this.head; current !== null; current = current.next) {
      yield [current.key, current.value];
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<[K, V]> {
    yield* this.entries();
  }
}

// Export for CommonJS
module.exports = AsyncLRUCache;
