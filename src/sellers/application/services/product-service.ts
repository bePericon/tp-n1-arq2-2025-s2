import { CreateProduct } from '../../domain/use-cases/create-product';
import { Product } from '../../domain/entities/product';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { ProductUseCase } from '../interfaces/product-use-case.interface';
import { ProductRepository } from '../../domain/repositories/product-repository';
import { GetProductById } from '../../domain/use-cases/get-product-by-id';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { UpdateProduct } from '../../domain/use-cases/update-product';
import { DeleteProduct } from '../../domain/use-cases/delete-product';

export class ProductService implements ProductUseCase {
	private readonly createProductUseCase: CreateProduct;
	private readonly getProductByIdUseCase: GetProductById;
	private readonly updateProductUseCase: UpdateProduct;
	private readonly deleteProductUseCase: DeleteProduct;

	constructor(readonly productRepository: ProductRepository) {
		this.createProductUseCase = new CreateProduct(productRepository);
		this.getProductByIdUseCase = new GetProductById(productRepository);
		this.updateProductUseCase = new UpdateProduct(productRepository);
		this.deleteProductUseCase = new DeleteProduct(productRepository);
	}

	async createProduct(createProductDto: CreateProductDto): Promise<ProductDto> {
		const product = await this.createProductUseCase.execute(
			createProductDto.name,
			createProductDto.description,
			createProductDto.price,
			createProductDto.stock,
			createProductDto.sellerId
		);
		return this.mapToProductDto(product);
	}

	async getProductById(id: string): Promise<ProductDto | null> {
		const product = await this.getProductByIdUseCase.execute(id);
		return product ? this.mapToProductDto(product) : null;
	}

	async updateProduct(
		id: string,
		updateProductDto: UpdateProductDto
	): Promise<ProductDto | null> {
		const product = await this.updateProductUseCase.execute(
			new Product({ _id: id, ...updateProductDto })
		);
		return product ? this.mapToProductDto(product) : null;
	}

	async deleteProduct(id: string): Promise<void> {
		await this.deleteProductUseCase.execute(id);
	}

	private mapToProductDto(product: Product): ProductDto {
		return {
			productId: product._id,
			name: product.name,
			description: product.description,
			price: product.price,
			stock: product.stock,
			sellerId: product.sellerId,
		};
	}
}
