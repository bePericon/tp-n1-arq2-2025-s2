import { Product } from '../entities/product';
import { ProductRepository } from '../repositories/product-repository';

export class CreateProduct {
	constructor(private readonly ProductRepository: ProductRepository) {}

	async execute(
		name: string,
		description: string,
		price: number,
		stock: number,
		sellerId: string
	): Promise<Product> {
		const product = new Product({ name, description, price, stock, sellerId });
		return this.ProductRepository.save(product);
	}
}
