import { Seller } from '../../domain/entities/seller';
import { SellerRepository } from '../../domain/repositories/seller-repository';
import sellerModel from '../models/seller.model';

export class MongoSellerRepository implements SellerRepository {
	async save(seller: Seller): Promise<Seller> {
		const createdSeller = new sellerModel({
			companyName: seller.companyName,
			mail: seller.mail,
			products: seller.products,
		});
		await createdSeller.save();
		return seller;
	}

	async getById(id: string): Promise<Seller | null> {
		const seller = await sellerModel.findById(id).exec();
		if (!seller) return null;

		return new Seller({
			_id: seller._id.toString(),
			companyName: seller.companyName,
			mail: seller.mail,
			products: seller.products.map(product => product._id.toString())
		});
	}

	async update(seller: Seller): Promise<Seller> {
		await sellerModel
			.findByIdAndUpdate(
				seller._id,
				{
					companyName: seller.companyName,
					mail: seller.mail,
					updatedAt: Date.now(),
				},
				{ new: true }
			)
			.exec();
		return seller;
	}

	async delete(id: string): Promise<void> {
		await sellerModel.findByIdAndDelete(id).exec();
	}

	async saveSellerWithProducts(seller: Seller): Promise<Seller> {
		await sellerModel
			.findByIdAndUpdate(
				seller._id,
				{
					companyName: seller.companyName,
					mail: seller.mail,
					products: seller.products,
					updatedAt: Date.now(),
				},
				{ new: true }
			)
			.exec();
		return seller;
	}
}
