import { SellerRepository } from '../repositories/seller-repository';

export class DeleteSeller {
	constructor(private readonly SellerRepository: SellerRepository) {}

	async execute(id: string): Promise<void> {
		return this.SellerRepository.delete(id);
	}
}
