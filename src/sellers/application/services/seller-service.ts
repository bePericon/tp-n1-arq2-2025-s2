import { CreateSeller } from '../../domain/use-cases/create-seller';
import { Seller } from '../../domain/entities/seller';
import { CreateSellerDto } from '../dtos/create-seller.dto';
import { SellerDto } from '../dtos/seller.dto';
import { SellerUseCase } from '../interfaces/seller-use-case.interface';
import { SellerRepository } from '../../domain/repositories/seller-repository';
import { GetSellerById } from '../../domain/use-cases/get-seller-by-id';
import { UpdateSellerDto } from '../dtos/update-seller.dto';
import { UpdateSeller } from '../../domain/use-cases/update-seller';
import { DeleteSeller } from '../../domain/use-cases/delete-seller';
import { SaveSellerWithProducts } from '../../domain/use-cases/save-seller-with-products';

export class SellerService implements SellerUseCase {
	private readonly createSellerUseCase: CreateSeller;
	private readonly getSellerByIdUseCase: GetSellerById;
	private readonly updateSellerUseCase: UpdateSeller;
	private readonly deleteSellerUseCase: DeleteSeller;
	private readonly saveSellerWithProductsUseCase: SaveSellerWithProducts;

	constructor(readonly sellerRepository: SellerRepository) {
		this.createSellerUseCase = new CreateSeller(sellerRepository);
		this.getSellerByIdUseCase = new GetSellerById(sellerRepository);
		this.updateSellerUseCase = new UpdateSeller(sellerRepository);
		this.deleteSellerUseCase = new DeleteSeller(sellerRepository);
		this.saveSellerWithProductsUseCase = new SaveSellerWithProducts(sellerRepository);
	}

	async createSeller(createSellerDto: CreateSellerDto): Promise<SellerDto> {
		const seller = await this.createSellerUseCase.execute(
			createSellerDto.companyName,
			createSellerDto.mail,
			createSellerDto.products
		);
		return this.mapToSellerDto(seller);
	}

	async getSellerById(id: string): Promise<SellerDto | null> {
		const seller = await this.getSellerByIdUseCase.execute(id);
		return seller ? this.mapToSellerDto(seller) : null;
	}

	async updateSeller(
		id: string,
		updateSellerDto: UpdateSellerDto
	): Promise<SellerDto | null> {
		const seller = await this.updateSellerUseCase.execute(
			new Seller({ _id: id, ...updateSellerDto })
		);
		return seller ? this.mapToSellerDto(seller) : null;
	}

	async deleteSeller(id: string): Promise<void> {
		await this.deleteSellerUseCase.execute(id);
	}

	async addProductToSeller(sellerId: string, productId: string): Promise<void> {
		const seller = await this.getSellerByIdUseCase.execute(sellerId);
		if (!seller) {
			throw new Error('Seller not found');
		}
		seller.products.push(productId);
		await this.saveSellerWithProductsUseCase.execute(seller);
	}

	private mapToSellerDto(seller: Seller): SellerDto {
		return {
			sellerId: seller._id,
			companyName: seller.companyName,
			mail: seller.mail,
			products: seller.products,
		};
	}
}
