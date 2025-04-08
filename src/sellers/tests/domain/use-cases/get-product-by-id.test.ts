import { GetProductById } from '../../../domain/use-cases/get-product-by-id';
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

describe('GetProductById', () => {
	let getProductById: GetProductById;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		getProductById = new GetProductById(mockProductRepository);
	});

	it('should get a product by id', async () => {
		// Arrange
		const productId = 'product-id-123';
		const expectedProduct = new Product({
			_id: productId,
			name: 'Laptop',
			description: 'High-performance laptop',
			price: 1200,
			stock: 10,
			sellerId: 'seller-id-456',
		});
		mockProductRepository.getById.mockResolvedValue(expectedProduct);

		// Act
		const product = await getProductById.execute(productId);

		// Assert
		expect(mockProductRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.getById).toHaveBeenCalledWith(productId);
		expect(product).toEqual(expectedProduct);
	});

	it('should return null if product is not found', async () => {
		// Arrange
		const productId = 'product-id-123';
		mockProductRepository.getById.mockResolvedValue(null);

		// Act
		const product = await getProductById.execute(productId);

		// Assert
		expect(mockProductRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.getById).toHaveBeenCalledWith(productId);
		expect(product).toBeNull();
	});

	it('should handle errors when getting a product', async () => {
		// Arrange
		const productId = 'product-id-123';
		const expectedError = new Error('Failed to get product');
		mockProductRepository.getById.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(getProductById.execute(productId)).rejects.toThrow(expectedError);
		expect(mockProductRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.getById).toHaveBeenCalledWith(productId);
	});

	it('should get a product by another id', async () => {
		// Arrange
		const productId = 'product-id-456';
		const expectedProduct = new Product({
			_id: productId,
			name: 'Monitor',
			description: '4k monitor',
			price: 300,
			stock: 20,
			sellerId: 'seller-id-789',
		});
		mockProductRepository.getById.mockResolvedValue(expectedProduct);

		// Act
		const product = await getProductById.execute(productId);

		// Assert
		expect(mockProductRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.getById).toHaveBeenCalledWith(productId);
		expect(product).toEqual(expectedProduct);
	});
});
