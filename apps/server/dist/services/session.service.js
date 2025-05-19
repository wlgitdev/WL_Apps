"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
// Using a simple in-memory store for demonstration
// In production, use Redis or another session store
class SessionService {
    constructor() {
        this.store = new Map();
    }
    async set(key, value, ttl = 600000) {
        this.store.set(key, value);
        setTimeout(() => this.store.delete(key), ttl); // Auto-cleanup after TTL (default 10 minutes)
    }
    async get(key) {
        return this.store.get(key);
    }
    async delete(key) {
        this.store.delete(key);
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map