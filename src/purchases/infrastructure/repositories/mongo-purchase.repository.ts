import { Purchase } from '../../domain/entities/purchase';
import { PurchaseRepository } from '../../domain/repositories/purchase-repository';
import purchaseModel from '../models/purchase.model';

export class MongoPurchaseRepository implements PurchaseRepository {
	async getById(id: string): Promise<Purchase | null> {
		const purchase = await purchaseModel.findById(id).exec();
		if (!purchase) return null;

		return this.mapModelToPurchase(purchase);
	}

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

	mapModelToPurchase(purchase: any): Purchase {
		return new Purchase({
			_id: purchase._id.toString(),
			quantity: purchase.quantity,
			productId: purchase.productId,
			userId: purchase.userId,
			name: purchase.name,
			description: purchase.description,
			price: purchase.price,
			sellerId: purchase.sellerId,
		});
	}
}
