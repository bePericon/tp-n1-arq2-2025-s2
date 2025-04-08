import { SaveSellerWithProducts } from '../../../domain/use-cases/save-seller-with-products';
import { SellerRepository } from '../../../domain/repositories/seller-repository';
import { Seller } from '../../../domain/entities/seller';
import { Product } from '../../../domain/entities/product';

// Mock the SellerRepository
const mockSellerRepository: jest.Mocked<SellerRepository> = {
	save: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getById: jest.fn(),
	saveSellerWithProducts: jest.fn(),
};

describe('SaveSellerWithProducts', () => {
	let saveSellerWithProducts: SaveSellerWithProducts;

	// Arrange
	const companyName = 'Acme Corp';
	const mail = 'info@acme.com';
	const products: Product[] = [
		new Product({
			_id: 'product-id-123',
			name: 'Laptop',
			description: 'High-performance laptop',
			price: 1200,
			stock: 10,
			sellerId: 'seller-id-123',
		}),
		new Product({
			_id: 'product-id-456',
			name: 'Monitor',
			description: '4k monitor',
			price: 300,
			stock: 20,
			sellerId: 'seller-id-123',
		}),
	];
	const expectedSeller = new Seller({
		companyName,
		mail,
		products: products.map((p) => p._id as string),
	});

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		saveSellerWithProducts = new SaveSellerWithProducts(mockSellerRepository);
	});

	it('should save a seller with products', async () => {
		mockSellerRepository.saveSellerWithProducts.mockResolvedValue(expectedSeller);

		// Act
		const seller = await saveSellerWithProducts.execute(
			new Seller({
				companyName,
				mail,
				products: products.map((p) => p._id as string),
			})
		);

		// Assert
		expect(mockSellerRepository.saveSellerWithProducts).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.saveSellerWithProducts).toHaveBeenCalledWith(
			expectedSeller
		);
		expect(seller).toEqual(expectedSeller);
	});

	it('should handle errors when saving a seller with products', async () => {
		const expectedError = new Error('Failed to save seller with products');
		mockSellerRepository.saveSellerWithProducts.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(
			saveSellerWithProducts.execute(
				new Seller({ companyName, mail, products: products.map((p) => p._id as string) })
			)
		).rejects.toThrow(expectedError);
		expect(mockSellerRepository.saveSellerWithProducts).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.saveSellerWithProducts).toHaveBeenCalledWith(expectedSeller);
	});
});
