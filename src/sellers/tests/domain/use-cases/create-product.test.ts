import { CreateProduct } from '../../../domain/use-cases/create-product';
import { ProductRepository } from '../../../domain/repositories/product-repository';
import { Product } from '../../../domain/entities/product';

// Mock the ProductRepository
const mockProductRepository: jest.Mocked<ProductRepository> = {
	save: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getById: jest.fn(),
	findByName: jest.fn(),
	findByPriceRange: jest.fn(),
};

describe('CreateProduct', () => {
	let createProduct: CreateProduct;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		createProduct = new CreateProduct(mockProductRepository);
	});

	it('should create a product and save it to the repository', async () => {
		// Arrange
		const name = 'Laptop';
		const description = 'High-performance laptop';
		const price = 1200;
		const stock = 10;
		const sellerId = 'seller-id-456';
		const expectedProduct = new Product({
			name,
			description,
			price,
			stock,
			sellerId,
		});
		mockProductRepository.save.mockResolvedValue(expectedProduct);

		// Act
		const product = await createProduct.execute(
			name,
			description,
			price,
			stock,
			sellerId
		);

		// Assert
		expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.save).toHaveBeenCalledWith(
			expect.objectContaining({ name, description, price, stock, sellerId })
		);
		expect(product).toEqual(expectedProduct);
	});

	it('should create a product with different data and save it to the repository', async () => {
		// Arrange
		const name = 'Monitor';
		const description = '4k monitor';
		const price = 300;
		const stock = 20;
		const sellerId = 'seller-id-789';
		const expectedProduct = new Product({
			name,
			description,
			price,
			stock,
			sellerId,
		});
		mockProductRepository.save.mockResolvedValue(expectedProduct);

		// Act
		const product = await createProduct.execute(
			name,
			description,
			price,
			stock,
			sellerId
		);

		// Assert
		expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.save).toHaveBeenCalledWith(
			expect.objectContaining({ name, description, price, stock, sellerId })
		);
		expect(product).toEqual(expectedProduct);
	});

	it('should handle errors when saving the product', async () => {
		// Arrange
		const name = 'Laptop';
		const description = 'High-performance laptop';
		const price = 1200;
		const stock = 10;
		const sellerId = 'seller-id-456';
		const expectedError = new Error('Failed to save product');
		mockProductRepository.save.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(
			createProduct.execute(name, description, price, stock, sellerId)
		).rejects.toThrow(expectedError);
		expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.save).toHaveBeenCalledWith(
			expect.objectContaining({ name, description, price, stock, sellerId })
		);
	});
});
