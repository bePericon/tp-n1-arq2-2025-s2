import { DecreaseStock } from '../../../domain/use-cases/decrease-stock';
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

describe('DecreaseStock', () => {
	let decreaseStock: DecreaseStock;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		decreaseStock = new DecreaseStock(mockProductRepository);
	});

	it('should decrease the stock of a product', async () => {
		// Arrange
		const productId = 'product-id-123';
		const quantity = 5;
		const initialStock = 10;
		const product = new Product({
			_id: productId,
			name: 'Laptop',
			description: 'High-performance laptop',
			price: 1200,
			stock: initialStock,
			sellerId: 'seller-id-456',
		});
		const updatedProduct = new Product({
			_id: productId,
			name: 'Laptop',
			description: 'High-performance laptop',
			price: 1200,
			stock: initialStock - quantity,
			sellerId: 'seller-id-456',
		});
		mockProductRepository.getById.mockResolvedValue(product);
		mockProductRepository.update.mockResolvedValue(updatedProduct);

		// Act
		const result = await decreaseStock.execute(productId, quantity);

		// Assert
		expect(mockProductRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.getById).toHaveBeenCalledWith(productId);
		expect(mockProductRepository.update).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.update).toHaveBeenCalledWith(
			expect.objectContaining({ stock: initialStock - quantity })
		);
		expect(result).toEqual(updatedProduct);
	});

	it('should return null if the product is not found', async () => {
		// Arrange
		const productId = 'product-id-123';
		const quantity = 5;
		mockProductRepository.getById.mockResolvedValue(null);

		// Act
		const result = await decreaseStock.execute(productId, quantity);

		// Assert
		expect(mockProductRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.getById).toHaveBeenCalledWith(productId);
		expect(mockProductRepository.update).not.toHaveBeenCalled();
		expect(result).toBeNull();
	});

	it('should handle errors when getting the product', async () => {
		// Arrange
		const productId = 'product-id-123';
		const quantity = 5;
		const expectedError = new Error('Failed to get product');
		mockProductRepository.getById.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(decreaseStock.execute(productId, quantity)).rejects.toThrow(
			expectedError
		);
		expect(mockProductRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.getById).toHaveBeenCalledWith(productId);
		expect(mockProductRepository.update).not.toHaveBeenCalled();
	});

	it('should handle errors when updating the product', async () => {
		// Arrange
		const productId = 'product-id-123';
		const quantity = 5;
		const initialStock = 10;
		const product = new Product({
			_id: productId,
			name: 'Laptop',
			description: 'High-performance laptop',
			price: 1200,
			stock: initialStock,
			sellerId: 'seller-id-456',
		});
		const expectedError = new Error('Failed to update product');
		mockProductRepository.getById.mockResolvedValue(product);
		mockProductRepository.update.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(decreaseStock.execute(productId, quantity)).rejects.toThrow(
			expectedError
		);
		expect(mockProductRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.getById).toHaveBeenCalledWith(productId);
		expect(mockProductRepository.update).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.update).toHaveBeenCalledWith(
			expect.objectContaining({ stock: initialStock - quantity })
		);
	});

	it('should decrease the stock of a product with different quantity', async () => {
		// Arrange
		const productId = 'product-id-456';
		const quantity = 10;
		const initialStock = 20;
		const product = new Product({
			_id: productId,
			name: 'Monitor',
			description: '4k monitor',
			price: 300,
			stock: initialStock,
			sellerId: 'seller-id-456',
		});
		const updatedProduct = new Product({
			_id: productId,
			name: 'Monitor',
			description: '4k monitor',
			price: 300,
			stock: initialStock - quantity,
			sellerId: 'seller-id-456',
		});
		mockProductRepository.getById.mockResolvedValue(product);
		mockProductRepository.update.mockResolvedValue(updatedProduct);

		// Act
		const result = await decreaseStock.execute(productId, quantity);

		// Assert
		expect(mockProductRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.getById).toHaveBeenCalledWith(productId);
		expect(mockProductRepository.update).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.update).toHaveBeenCalledWith(
			expect.objectContaining({ stock: initialStock - quantity })
		);
		expect(result).toEqual(updatedProduct);
	});
});
