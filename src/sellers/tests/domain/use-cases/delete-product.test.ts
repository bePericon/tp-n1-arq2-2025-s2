import { DeleteProduct } from '../../../domain/use-cases/delete-product';
import { ProductRepository } from '../../../domain/repositories/product-repository';

// Mock the ProductRepository
const mockProductRepository: jest.Mocked<ProductRepository> = {
	save: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getById: jest.fn(),
	findByName: jest.fn(),
	findByPriceRange: jest.fn(),
};

describe('DeleteProduct', () => {
	let deleteProduct: DeleteProduct;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		deleteProduct = new DeleteProduct(mockProductRepository);
	});

	it('should delete a product by id', async () => {
		// Arrange
		const productId = 'product-id-123';
		mockProductRepository.delete.mockResolvedValue();

		// Act
		await deleteProduct.execute(productId);

		// Assert
		expect(mockProductRepository.delete).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.delete).toHaveBeenCalledWith(productId);
	});

	it('should handle errors when deleting a product', async () => {
		// Arrange
		const productId = 'product-id-123';
		const expectedError = new Error('Failed to delete product');
		mockProductRepository.delete.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(deleteProduct.execute(productId)).rejects.toThrow(expectedError);
		expect(mockProductRepository.delete).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.delete).toHaveBeenCalledWith(productId);
	});

	it('should delete a product by another id', async () => {
		// Arrange
		const productId = 'product-id-456';
		mockProductRepository.delete.mockResolvedValue();

		// Act
		await deleteProduct.execute(productId);

		// Assert
		expect(mockProductRepository.delete).toHaveBeenCalledTimes(1);
		expect(mockProductRepository.delete).toHaveBeenCalledWith(productId);
	});
});
