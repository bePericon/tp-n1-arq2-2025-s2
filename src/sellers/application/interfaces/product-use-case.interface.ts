import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDto } from '../dtos/product.dto';

export interface ProductUseCase {
	createProduct(createProductDto: CreateProductDto): Promise<ProductDto>;
	getProductById(id: string): Promise<ProductDto | null>;
	updateProduct(id: string, updateProductDto: CreateProductDto): Promise<ProductDto | null>;
	deleteProduct(id: string): Promise<void>;
	decreaseStock(productId: string, quantity: number): Promise<void>;
	searchProductsByName(name: string): Promise<ProductDto[]>;
}