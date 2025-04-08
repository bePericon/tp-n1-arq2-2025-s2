import { DeleteSeller } from '../../../domain/use-cases/delete-seller';
import { SellerRepository } from '../../../domain/repositories/seller-repository';

// Mock the SellerRepository
const mockSellerRepository: jest.Mocked<SellerRepository> = {
	save: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getById: jest.fn(),
	saveSellerWithProducts: jest.fn(),
};

describe('DeleteSeller', () => {
	let deleteSeller: DeleteSeller;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		deleteSeller = new DeleteSeller(mockSellerRepository);
	});

	it('should delete a seller by id', async () => {
		// Arrange
		const sellerId = 'seller-id-123';
		mockSellerRepository.delete.mockResolvedValue();

		// Act
		await deleteSeller.execute(sellerId);

		// Assert
		expect(mockSellerRepository.delete).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.delete).toHaveBeenCalledWith(sellerId);
	});

	it('should handle errors when deleting a seller', async () => {
		// Arrange
		const sellerId = 'seller-id-123';
		const expectedError = new Error('Failed to delete seller');
		mockSellerRepository.delete.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(deleteSeller.execute(sellerId)).rejects.toThrow(expectedError);
		expect(mockSellerRepository.delete).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.delete).toHaveBeenCalledWith(sellerId);
	});

	it('should delete a seller by another id', async () => {
		// Arrange
		const sellerId = 'seller-id-456';
		mockSellerRepository.delete.mockResolvedValue();

		// Act
		await deleteSeller.execute(sellerId);

		// Assert
		expect(mockSellerRepository.delete).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.delete).toHaveBeenCalledWith(sellerId);
	});
});
