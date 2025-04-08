import { GetSellerById } from '../../../domain/use-cases/get-seller-by-id';
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

describe('GetSellerById', () => {
	let getSellerById: GetSellerById;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		getSellerById = new GetSellerById(mockSellerRepository);
	});

	it('should get a seller by id', async () => {
		// Arrange
		const sellerId = 'seller-id-123';
		const expectedSeller = new Seller({
			_id: sellerId,
			companyName: 'Acme Corp',
			mail: 'info@acme.com',
			products: ['product-id-1', 'product-id-2'],
		});
		mockSellerRepository.getById.mockResolvedValue(expectedSeller);

		// Act
		const seller = await getSellerById.execute(sellerId);

		// Assert
		expect(mockSellerRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.getById).toHaveBeenCalledWith(sellerId);
		expect(seller).toEqual(expectedSeller);
	});

	it('should return null if seller is not found', async () => {
		// Arrange
		const sellerId = 'seller-id-123';
		mockSellerRepository.getById.mockResolvedValue(null);

		// Act
		const seller = await getSellerById.execute(sellerId);

		// Assert
		expect(mockSellerRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.getById).toHaveBeenCalledWith(sellerId);
		expect(seller).toBeNull();
	});

	it('should handle errors when getting a seller', async () => {
		// Arrange
		const sellerId = 'seller-id-123';
		const expectedError = new Error('Failed to get seller');
		mockSellerRepository.getById.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(getSellerById.execute(sellerId)).rejects.toThrow(expectedError);
		expect(mockSellerRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.getById).toHaveBeenCalledWith(sellerId);
	});

	it('should get a seller by another id', async () => {
		// Arrange
		const sellerId = 'seller-id-456';
		const expectedSeller = new Seller({
			_id: sellerId,
			companyName: 'Widget Co',
			mail: 'contact@widgetco.com',
			products: [],
		});
		mockSellerRepository.getById.mockResolvedValue(expectedSeller);

		// Act
		const seller = await getSellerById.execute(sellerId);

		// Assert
		expect(mockSellerRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockSellerRepository.getById).toHaveBeenCalledWith(sellerId);
		expect(seller).toEqual(expectedSeller);
	});
});
