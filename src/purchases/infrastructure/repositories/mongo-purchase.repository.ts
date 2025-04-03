import { Purchase } from '../../domain/entities/purchase';
import { PurchaseRepository } from '../../domain/repositories/purchase-repository';
import purchaseModel from '../models/purchase.model';

export class MongoPurchaseRepository implements PurchaseRepository {
	async save(entity: Purchase): Promise<Purchase> {
		const createdPurchase = new purchaseModel({
			productId: entity.productId,
			name: entity.name,
			description: entity.description,
			price: entity.price,
			quantity: entity.quantity,
			user: entity.userId,
		});

		await createdPurchase.save();
		return entity;
	}
}
