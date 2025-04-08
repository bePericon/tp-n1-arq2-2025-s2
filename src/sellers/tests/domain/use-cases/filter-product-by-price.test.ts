import {
	FilterProductsByPrice,
	PriceFilter,
} from '../../../domain/use-cases/filter-products-by-price';
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

describe('FilterProductsByPrice', () => {
	let filterProductsByPrice: FilterProductsByPrice;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		filterProductsByPrice = new FilterProductsByPrice(mockProductRepository);
	});

	it('should filter products by price range', async () => {
		// Arrange
		const filters: PriceFilter = { min: 100, max: 500 };
		const expectedProducts = [
			new Product({
				_id: 'product-id-123',
				name: 'Monitor',
				description: '4k monitor',
				price: 300,
				stock: 20,
				sellerId: 'seller-id-789',
			}),
			new Product({
				_id: 'product-id-456',
				name: 'Keyboard',
				description: 'Mechanical keyboard',
				price: 150,
				stock: 15,
				sellerId: 'seller-id-456',
			}),
		];
		mockProductRepository.findByPriceRange.mockResolvedValue(expectedProducts);

		// Act
		const products = await filterProductsByPrice.execute(filters);

		// Assert
		expect(mockProductRepository.findByPriceRange).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.findByPriceRange).toHaveBeenCalledWith(filters);
		expect(products).toEqual(expectedProducts);
	});

	it('should return an empty array if no products match the filters', async () => {
		// Arrange
		const filters: PriceFilter = { min: 1000, max: 2000 };
		mockProductRepository.findByPriceRange.mockResolvedValue([]);

		// Act
		const products = await filterProductsByPrice.execute(filters);

		// Assert
		expect(mockProductRepository.findByPriceRange).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.findByPriceRange).toHaveBeenCalledWith(filters);
		expect(products).toEqual([]);
	});

	it('should handle errors when filtering products by price', async () => {
		// Arrange
		const filters: PriceFilter = { min: 100, max: 500 };
		const expectedError = new Error('Failed to filter products by price');
		mockProductRepository.findByPriceRange.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(filterProductsByPrice.execute(filters)).rejects.toThrow(
			expectedError
		);
		expect(mockProductRepository.findByPriceRange).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.findByPriceRange).toHaveBeenCalledWith(filters);
	});

	it('should filter products by another price range', async () => {
		// Arrange
		const filters: PriceFilter = { min: 500, max: 1000 };
		const expectedProducts = [
			new Product({
				_id: 'product-id-789',
				name: 'Mouse',
				description: 'Wireless mouse',
				price: 600,
				stock: 10,
				sellerId: 'seller-id-123',
			}),
		];
		mockProductRepository.findByPriceRange.mockResolvedValue(expectedProducts);

		// Act
		const products = await filterProductsByPrice.execute(filters);

		// Assert
		expect(mockProductRepository.findByPriceRange).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.findByPriceRange).toHaveBeenCalledWith(filters);
		expect(products).toEqual(expectedProducts);
	});

	it('should filter products by greaterThan', async () => {
		// Arrange
		const filters: PriceFilter = { greaterThan: 500 };
		const expectedProducts = [
			new Product({
				_id: 'product-id-789',
				name: 'Mouse',
				description: 'Wireless mouse',
				price: 600,
				stock: 10,
				sellerId: 'seller-id-123',
			}),
		];
		mockProductRepository.findByPriceRange.mockResolvedValue(expectedProducts);

		// Act
		const products = await filterProductsByPrice.execute(filters);

		// Assert
		expect(mockProductRepository.findByPriceRange).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.findByPriceRange).toHaveBeenCalledWith(filters);
		expect(products).toEqual(expectedProducts);
	});

	it('should filter products by lessThan', async () => {
		// Arrange
		const filters: PriceFilter = { lessThan: 500 };
		const expectedProducts = [
			new Product({
				_id: 'product-id-789',
				name: 'Mouse',
				description: 'Wireless mouse',
				price: 400,
				stock: 10,
				sellerId: 'seller-id-123',
			}),
		];
		mockProductRepository.findByPriceRange.mockResolvedValue(expectedProducts);

		// Act
		const products = await filterProductsByPrice.execute(filters);

		// Assert
		expect(mockProductRepository.findByPriceRange).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.findByPriceRange).toHaveBeenCalledWith(filters);
		expect(products).toEqual(expectedProducts);
	});
});
