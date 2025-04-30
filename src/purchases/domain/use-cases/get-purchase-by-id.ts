import { Purchase } from '../entities/purchase';
import { PurchaseRepository } from '../repositories/purchase-repository';

export class GetPurchaseById {
	constructor(private readonly PurchaseRepository: PurchaseRepository) {}

	async execute(id: string): Promise<Purchase | null> {
		return this.PurchaseRepository.getById(id);
	}
}
