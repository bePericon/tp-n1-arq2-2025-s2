import { CreateUser } from '../../../domain/use-cases/create-user';
import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/repositories/user-repository';

// Mock the UserRepository
const mockUserRepository: jest.Mocked<UserRepository> = {
	save: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getById: jest.fn(),
};

describe('CreateUser', () => {
	let createUser: CreateUser;

	beforeEach(() => {
		// Clear all mock calls before each test
		jest.clearAllMocks();
		createUser = new CreateUser(mockUserRepository);
	});

	it('should create a user and save it to the repository', async () => {
		// Arrange
		const name = 'John';
		const lastName = 'Doe';
		const mail = 'john.doe@example.com';
		const expectedUser = new User({ name, lastName, mail });
		mockUserRepository.save.mockResolvedValue(expectedUser);

		// Act
		const user = await createUser.execute(name, lastName, mail);

		// Assert
		expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.save).toHaveBeenCalledWith(
			expect.objectContaining({ name, lastName, mail })
		);
		expect(user).toEqual(expectedUser);
	});

	it('should create a user with different data and save it to the repository', async () => {
		// Arrange
		const name = 'Jane';
		const lastName = 'Smith';
		const mail = 'jane.smith@example.com';
		const expectedUser = new User({ name, lastName, mail });
		mockUserRepository.save.mockResolvedValue(expectedUser);

		// Act
		const user = await createUser.execute(name, lastName, mail);

		// Assert
		expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.save).toHaveBeenCalledWith(
			expect.objectContaining({ name, lastName, mail })
		);
		expect(user).toEqual(expectedUser);
	});

	it('should handle errors when saving the user', async () => {
		// Arrange
		const name = 'John';
		const lastName = 'Doe';
		const mail = 'john.doe@example.com';
		const expectedError = new Error('Failed to save user');
		mockUserRepository.save.mockRejectedValue(expectedError);

		// Act & Assert
		await expect(createUser.execute(name, lastName, mail)).rejects.toThrow(
			expectedError
		);
		expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.save).toHaveBeenCalledWith(
			expect.objectContaining({ name, lastName, mail })
		);
	});
});
