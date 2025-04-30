import { Purchase } from '../entities/purchase';

export interface PurchaseRepository {
        save(entity: Purchase): Promise<Purchase>;
        getById(id: string): Promise<Purchase | null>;
}
