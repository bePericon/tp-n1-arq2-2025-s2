import { Seller } from '../entities/seller';
import { SellerRepository } from '../repositories/seller-repository';

export class CreateSeller {
	constructor(private readonly SellerRepository: SellerRepository) {}

	async execute(
		companyName: string,
		mail: string,
		products: any[]
	): Promise<Seller> {
		const seller = new Seller({ companyName, mail, products });
		return this.SellerRepository.save(seller);
	}
}
