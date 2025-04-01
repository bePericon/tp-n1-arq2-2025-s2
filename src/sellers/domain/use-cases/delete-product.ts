import { ProductRepository } from '../repositories/product-repository';

export class DeleteProduct {
	constructor(private readonly ProductRepository: ProductRepository) {}

	async execute(id: string): Promise<void> {
		return this.ProductRepository.delete(id);
	}
}
