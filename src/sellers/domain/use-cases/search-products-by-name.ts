import { Product } from '../entities/product';
import { ProductRepository } from '../repositories/product-repository';

export class SearchProductsByName {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(name: string): Promise<Product[]> {
    if (!name || name.trim() === '') {
      return []; // Devolver un array vacío si el nombre está vacío
    }
    return this.productRepository.findByName(name.trim());
  }
}