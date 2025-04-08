import { UpdateProduct } from '../../../domain/use-cases/update-product';
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

describe('UpdateProduct', () => {
	let updateProduct: UpdateProduct;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		updateProduct = new UpdateProduct(mockProductRepository);
	});

	it('should update a product', async () => {
		// Arrange
		const product = new Product({
			_id: 'product-id-123',
			name: 'Laptop',
			description: 'High-performance laptop',
			price: 1200,
			stock: 10,
			sellerId: 'seller-id-456',
		});
		mockProductRepository.update.mockResolvedValue(product);

		// Act
		const updatedProduct = await updateProduct.execute(product);

		// Assert
		expect(mockProductRepository.update).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.update).toHaveBeenCalledWith(product);
		expect(updatedProduct).toEqual(product);
	});

	it('should handle errors when updating a product', async () => {
		// Arrange
		const product = new Product({
			_id: 'product-id-123',
			name: 'Laptop',
			description: 'High-performance laptop',
			price: 1200,
			stock: 10,
			sellerId: 'seller-id-456',
		});
		const expectedError = new Error('Failed to update product');
		mockProductRepository.update.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(updateProduct.execute(product)).rejects.toThrow(expectedError);
		expect(mockProductRepository.update).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.update).toHaveBeenCalledWith(product);
	});

	it('should update a product with different data', async () => {
		// Arrange
		const product = new Product({
			_id: 'product-id-456',
			name: 'Monitor',
			description: '4k monitor',
			price: 300,
			stock: 20,
			sellerId: 'seller-id-789',
		});
		mockProductRepository.update.mockResolvedValue(product);

		// Act
		const updatedProduct = await updateProduct.execute(product);

		// Assert
		expect(mockProductRepository.update).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.update).toHaveBeenCalledWith(product);
		expect(updatedProduct).toEqual(product);
	});
});
