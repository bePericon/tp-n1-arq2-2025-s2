import { UpdateUser } from '../../../domain/use-cases/update-user';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { User } from '../../../domain/entities/user';

// Mock the UserRepository
const mockUserRepository: jest.Mocked<UserRepository> = {
	save: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getById: jest.fn(),
};

describe('UpdateUser', () => {
	let updateUser: UpdateUser;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		updateUser = new UpdateUser(mockUserRepository);
	});

	it('should update a user', async () => {
		// Arrange
		const user = new User({
			_id: 'user-id-123',
			name: 'John',
			lastName: 'Doe',
			mail: 'john.doe@example.com',
		});
		mockUserRepository.update.mockResolvedValue(user);

		// Act
		const updatedUser = await updateUser.execute(user);

		// Assert
		expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.update).toHaveBeenCalledWith(user);
		expect(updatedUser).toEqual(user);
	});

	it('should handle errors when updating a user', async () => {
		// Arrange
		const user = new User({
			_id: 'user-id-123',
			name: 'John',
			lastName: 'Doe',
			mail: 'john.doe@example.com',
		});
		const expectedError = new Error('Failed to update user');
		mockUserRepository.update.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(updateUser.execute(user)).rejects.toThrow(expectedError);
		expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.update).toHaveBeenCalledWith(user);
	});

	it('should update a user with different data', async () => {
		// Arrange
		const user = new User({
			_id: 'user-id-456',
			name: 'Jane',
			lastName: 'Smith',
			mail: 'jane.smith@example.com',
		});
		mockUserRepository.update.mockResolvedValue(user);

		// Act
		const updatedUser = await updateUser.execute(user);

		// Assert
		expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.update).toHaveBeenCalledWith(user);
		expect(updatedUser).toEqual(user);
	});
});
