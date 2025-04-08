import { CreateSeller } from '../../../domain/use-cases/create-seller';
import { SellerRepository } from '../../../domain/repositories/seller-repository';
import { Seller } from '../../../domain/entities/seller';

// Mock the SellerRepository
const mockSellerRepository: jest.Mocked<SellerRepository> = {
	save: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getById: jest.fn(),
	saveSellerWithProducts: jest.fn(),
};

describe('CreateSeller', () => {
	let createSeller: CreateSeller;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		createSeller = new CreateSeller(mockSellerRepository);
	});

	it('should create a seller and save it to the repository', async () => {
		// Arrange
		const companyName = 'Acme Corp';
		const mail = 'info@acme.com';
		const products = ['product-id-1', 'product-id-2'];
		const expectedSeller = new Seller({ companyName, mail, products });
		mockSellerRepository.save.mockResolvedValue(expectedSeller);

		// Act
		const seller = await createSeller.execute(companyName, mail, products);

		// Assert
		expect(mockSellerRepository.save).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.save).toHaveBeenCalledWith(
			expect.objectContaining({ companyName, mail, products })
		);
		expect(seller).toEqual(expectedSeller);
	});

	it('should create a seller with different data and save it to the repository', async () => {
		// Arrange
		const companyName = 'Widget Co';
		const mail = 'contact@widgetco.com';
		const products: string[] = [];
		const expectedSeller = new Seller({ companyName, mail, products });
		mockSellerRepository.save.mockResolvedValue(expectedSeller);

		// Act
		const seller = await createSeller.execute(companyName, mail, products);

		// Assert
		expect(mockSellerRepository.save).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.save).toHaveBeenCalledWith(
			expect.objectContaining({ companyName, mail, products })
		);
		expect(seller).toEqual(expectedSeller);
	});

	it('should handle errors when saving the seller', async () => {
		// Arrange
		const companyName = 'Acme Corp';
		const mail = 'info@acme.com';
		const products = ['product-id-1', 'product-id-2'];
		const expectedError = new Error('Failed to save seller');
		mockSellerRepository.save.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(createSeller.execute(companyName, mail, products)).rejects.toThrow(
			expectedError
		);
		expect(mockSellerRepository.save).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.save).toHaveBeenCalledWith(
			expect.objectContaining({ companyName, mail, products })
		);
	});
});
