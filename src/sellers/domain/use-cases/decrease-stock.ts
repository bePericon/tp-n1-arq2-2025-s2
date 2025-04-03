import { Product } from '../entities/product';
import { ProductRepository } from '../repositories/product-repository';

export class DecreaseStock {
	constructor(private readonly productRepository: ProductRepository) {}

	async execute(productId: string, quantity: number): Promise<Product | null> {
		const product = await this.productRepository.getById(productId);
		if (!product) return null;

		product.decrease(quantity);
		return this.productRepository.update(product);
	}
}
