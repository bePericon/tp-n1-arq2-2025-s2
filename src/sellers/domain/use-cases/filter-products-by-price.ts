import { Product } from '../entities/product';
import { ProductRepository } from '../repositories/product-repository';

export interface PriceFilter {
	greaterThan?: number;
	lessThan?: number;
	min?: number;
	max?: number;
}

export class FilterProductsByPrice {
	constructor(private readonly productRepository: ProductRepository) {}

	async execute(filters: PriceFilter): Promise<Product[]> {
		return this.productRepository.findByPriceRange(filters);
	}
}
