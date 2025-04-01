import { Seller } from '../entities/seller';
import { SellerRepository } from '../repositories/seller-repository';

export class SaveSellerWithProducts {
	constructor(private readonly SellerRepository: SellerRepository) {}

	async execute(seller: Seller): Promise<Seller> {
		return this.SellerRepository.saveSellerWithProducts(seller);
	}
}
