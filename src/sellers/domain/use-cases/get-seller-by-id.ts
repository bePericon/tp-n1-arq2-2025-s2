import { Seller } from '../entities/seller';
import { SellerRepository } from '../repositories/seller-repository';

export class GetSellerById {
	constructor(private readonly SellerRepository: SellerRepository) {}

	async execute(id: string): Promise<Seller | null> {
		return this.SellerRepository.getById(id);
	}
}
