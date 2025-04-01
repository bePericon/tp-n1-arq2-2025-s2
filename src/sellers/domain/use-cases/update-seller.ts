import { Seller } from '../entities/seller';
import { SellerRepository } from '../repositories/seller-repository';

export class UpdateSeller {
	constructor(private readonly SellerRepository: SellerRepository) {}

	async execute(seller: Seller): Promise<Seller> {
		return this.SellerRepository.update(seller);
	}
}
