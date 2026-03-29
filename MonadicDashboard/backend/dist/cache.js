"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
class TTLCache {
    constructor() {
        this.store = new Map();
    }
    set(key, data, ttlSeconds) {
        this.store.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
    }
    get(key) {
        const entry = this.store.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.data;
    }
    has(key) {
        return this.get(key) !== null;
    }
    invalidate(key) {
        this.store.delete(key);
    }
}
exports.cache = new TTLCache();
