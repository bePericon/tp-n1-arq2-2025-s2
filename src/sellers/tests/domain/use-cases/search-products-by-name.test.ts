import { SearchProductsByName } from '../../../domain/use-cases/search-products-by-name';
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

describe('SearchProductsByName', () => {
	let searchProductsByName: SearchProductsByName;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		searchProductsByName = new SearchProductsByName(mockProductRepository);
	});

	it('should search for products by name', async () => {
		// Arrange
		const productName = 'Laptop';
		const expectedProducts = [
			new Product({
				_id: 'product-id-123',
				name: productName,
				description: 'High-performance laptop',
				price: 1200,
				stock: 10,
				sellerId: 'seller-id-456',
			}),
		];
		mockProductRepository.findByName.mockResolvedValue(expectedProducts);

		// Act
		const products = await searchProductsByName.execute(productName);

		// Assert
		expect(mockProductRepository.findByName).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.findByName).toHaveBeenCalledWith(productName);
		expect(products).toEqual(expectedProducts);
	});

	it('should return an empty array if no products match the name', async () => {
		// Arrange
		const productName = 'Nonexistent Product';
		mockProductRepository.findByName.mockResolvedValue([]);

		// Act
		const products = await searchProductsByName.execute(productName);

		// Assert
		expect(mockProductRepository.findByName).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.findByName).toHaveBeenCalledWith(productName);
		expect(products).toEqual([]);
	});

	it('should handle errors when searching for products by name', async () => {
		// Arrange
		const productName = 'Laptop';
		const expectedError = new Error('Failed to search for products by name');
		mockProductRepository.findByName.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(searchProductsByName.execute(productName)).rejects.toThrow(
			expectedError
		);
		expect(mockProductRepository.findByName).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.findByName).toHaveBeenCalledWith(productName);
	});

	it('should return an empty array if the name is empty', async () => {
		// Arrange
		const productName = '';

		// Act
		const products = await searchProductsByName.execute(productName);

		// Assert
		expect(mockProductRepository.findByName).not.toHaveBeenCalled();
		expect(products).toEqual([]);
	});

	it('should return an empty array if the name is only spaces', async () => {
		// Arrange
		const productName = '   ';

		// Act
		const products = await searchProductsByName.execute(productName);

		// Assert
		expect(mockProductRepository.findByName).not.toHaveBeenCalled();
		expect(products).toEqual([]);
	});

	it('should search for products by another name', async () => {
		// Arrange
		const productName = 'Monitor';
		const expectedProducts = [
			new Product({
				_id: 'product-id-456',
				name: productName,
				description: '4k monitor',
				price: 300,
				stock: 20,
				sellerId: 'seller-id-789',
			}),
		];
		mockProductRepository.findByName.mockResolvedValue(expectedProducts);

		// Act
		const products = await searchProductsByName.execute(productName);

		// Assert
		expect(mockProductRepository.findByName).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.findByName).toHaveBeenCalledWith(productName);
		expect(products).toEqual(expectedProducts);
	});
});
