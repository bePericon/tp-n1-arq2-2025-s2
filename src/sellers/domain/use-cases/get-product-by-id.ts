import { Product } from '../entities/product';
import { ProductRepository } from '../repositories/product-repository';

export class GetProductById {
	constructor(private readonly ProductRepository: ProductRepository) {}

	async execute(id: string): Promise<Product | null> {
		return this.ProductRepository.getById(id);
	}
}
