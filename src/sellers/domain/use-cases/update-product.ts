import { Product } from '../entities/product';
import { ProductRepository } from '../repositories/product-repository';

export class UpdateProduct {
	constructor(private readonly ProductRepository: ProductRepository) {}

	async execute(product: Product): Promise<Product> {
		return this.ProductRepository.update(product);
	}
}
