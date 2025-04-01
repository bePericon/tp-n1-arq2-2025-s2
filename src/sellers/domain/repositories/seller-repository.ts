import { CRUDRepository } from '../../../shared/domain/repositories/crud-repository';
import { Seller } from '../entities/seller';

export interface SellerRepository extends CRUDRepository<Seller> {
	saveSellerWithProducts(seller: Seller): Promise<Seller>;
}
