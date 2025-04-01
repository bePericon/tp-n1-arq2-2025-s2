import { CreateSellerDto } from '../dtos/create-seller.dto';
import { SellerDto } from '../dtos/seller.dto';

export interface SellerUseCase {
	createSeller(createSellerDto: CreateSellerDto): Promise<SellerDto>;
	getSellerById(id: string): Promise<SellerDto | null>;
	updateSeller(id: string, updateSellerDto: CreateSellerDto): Promise<SellerDto | null>;
	deleteSeller(id: string): Promise<void>;
	addProductToSeller(sellerId: string, productId: string): Promise<void>;
}