 // Using a simple in-memory store for demonstration
// In production, use Redis or another session store
export class SessionService {
  private store: Map<string, any> = new Map();

  async set(key: string, value: any, ttl: number = 600000): Promise<void> {
    this.store.set(key, value);
    setTimeout(() => this.store.delete(key), ttl); // Auto-cleanup after TTL (default 10 minutes)
  }

  async get(key: string): Promise<any> {
    return this.store.get(key);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}