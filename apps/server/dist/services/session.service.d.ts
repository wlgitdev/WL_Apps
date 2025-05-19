export declare class SessionService {
    private store;
    set(key: string, value: any, ttl?: number): Promise<void>;
    get(key: string): Promise<any>;
    delete(key: string): Promise<void>;
}
//# sourceMappingURL=session.service.d.ts.map