import { CRUDRepository } from '../../../shared/domain/repositories/crud-repository';
import { Product } from '../entities/product';

export interface ProductRepository extends CRUDRepository<Product> {}
