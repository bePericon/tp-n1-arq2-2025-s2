import { CRUDRepository } from '../../../shared/domain/repositories/crud-repository';
import { Product } from '../entities/product';
import { PriceFilter } from '../use-cases/filter-products-by-price';

export interface ProductRepository extends CRUDRepository<Product> {
	findByName(name: string): Promise<Product[]>;
	findByPriceRange(filters: PriceFilter): Promise<Product[]>;
}
