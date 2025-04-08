import { DeleteUser } from '../../../domain/use-cases/delete-user';
import { UserRepository } from '../../../domain/repositories/user-repository';

// Mock the UserRepository
const mockUserRepository: jest.Mocked<UserRepository> = {
	save: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getById: jest.fn(),
};

describe('DeleteUser', () => {
	let deleteUser: DeleteUser;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		deleteUser = new DeleteUser(mockUserRepository);
	});

	it('should delete a user by id', async () => {
		// Arrange
		const userId = 'user-id-123';
		mockUserRepository.delete.mockResolvedValue();

		// Act
		await deleteUser.execute(userId);

		// Assert
		expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
	});

	it('should handle errors when deleting a user', async () => {
		// Arrange
		const userId = 'user-id-123';
		const expectedError = new Error('Failed to delete user');
		mockUserRepository.delete.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(deleteUser.execute(userId)).rejects.toThrow(expectedError);
		expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
	});

	it('should delete a user by another id', async () => {
		// Arrange
		const userId = 'user-id-456';
		mockUserRepository.delete.mockResolvedValue();

		// Act
		await deleteUser.execute(userId);

		// Assert
		expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
	});
});
