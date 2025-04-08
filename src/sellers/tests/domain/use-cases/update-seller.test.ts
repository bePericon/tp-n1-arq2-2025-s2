import { UpdateSeller } from '../../../domain/use-cases/update-seller';
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

describe('UpdateSeller', () => {
	let updateSeller: UpdateSeller;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		updateSeller = new UpdateSeller(mockSellerRepository);
	});

	it('should update a seller', async () => {
		// Arrange
		const seller = new Seller({
			_id: 'seller-id-123',
			companyName: 'Acme Corp',
			mail: 'info@acme.com',
			products: ['product-id-1', 'product-id-2'],
		});
		mockSellerRepository.update.mockResolvedValue(seller);

		// Act
		const updatedSeller = await updateSeller.execute(seller);

		// Assert
		expect(mockSellerRepository.update).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.update).toHaveBeenCalledWith(seller);
		expect(updatedSeller).toEqual(seller);
	});

	it('should handle errors when updating a seller', async () => {
		// Arrange
		const seller = new Seller({
			_id: 'seller-id-123',
			companyName: 'Acme Corp',
			mail: 'info@acme.com',
			products: ['product-id-1', 'product-id-2'],
		});
		const expectedError = new Error('Failed to update seller');
		mockSellerRepository.update.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(updateSeller.execute(seller)).rejects.toThrow(expectedError);
		expect(mockSellerRepository.update).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.update).toHaveBeenCalledWith(seller);
	});

	it('should update a seller with different data', async () => {
		// Arrange
		const seller = new Seller({
			_id: 'seller-id-456',
			companyName: 'Widget Co',
			mail: 'contact@widgetco.com',
			products: [],
		});
		mockSellerRepository.update.mockResolvedValue(seller);

		// Act
		const updatedSeller = await updateSeller.execute(seller);

		// Assert
		expect(mockSellerRepository.update).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.update).toHaveBeenCalledWith(seller);
		expect(updatedSeller).toEqual(seller);
	});
});
