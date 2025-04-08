import { GetUserById } from '../../../domain/use-cases/get-user-by-id';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { User } from '../../../domain/entities/user';

// Mock the UserRepository
const mockUserRepository: jest.Mocked<UserRepository> = {
	save: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getById: jest.fn(),
};

describe('GetUserById', () => {
	let getUserById: GetUserById;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		getUserById = new GetUserById(mockUserRepository);
	});

	it('should get a user by id', async () => {
		// Arrange
		const userId = 'user-id-123';
		const expectedUser = new User({
			_id: userId,
			name: 'John',
			lastName: 'Doe',
			mail: 'john.doe@example.com',
		});
		mockUserRepository.getById.mockResolvedValue(expectedUser);

		// Act
		const user = await getUserById.execute(userId);

		// Assert
		expect(mockUserRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.getById).toHaveBeenCalledWith(userId);
		expect(user).toEqual(expectedUser);
	});

	it('should return null if user is not found', async () => {
		// Arrange
		const userId = 'user-id-123';
		mockUserRepository.getById.mockResolvedValue(null);

		// Act
		const user = await getUserById.execute(userId);

		// Assert
		expect(mockUserRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.getById).toHaveBeenCalledWith(userId);
		expect(user).toBeNull();
	});

	it('should handle errors when getting a user', async () => {
		// Arrange
		const userId = 'user-id-123';
		const expectedError = new Error('Failed to get user');
		mockUserRepository.getById.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(getUserById.execute(userId)).rejects.toThrow(expectedError);
		expect(mockUserRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.getById).toHaveBeenCalledWith(userId);
	});

	it('should get a user by another id', async () => {
		// Arrange
		const userId = 'user-id-456';
		const expectedUser = new User({
			_id: userId,
			name: 'Jane',
			lastName: 'Smith',
			mail: 'jane.smith@example.com',
		});
		mockUserRepository.getById.mockResolvedValue(expectedUser);

		// Act
		const user = await getUserById.execute(userId);

		// Assert
		expect(mockUserRepository.getById).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.getById).toHaveBeenCalledWith(userId);
		expect(user).toEqual(expectedUser);
	});
});
