import { User, UserProps } from '../../../domain/entities/user';

describe('User', () => {
	it('should create a User instance with all properties', () => {
		const props: UserProps = {
			_id: 'user-id-123',
			name: 'John',
			lastName: 'Doe',
			mail: 'john.doe@example.com',
		};
		const user = new User(props);

		expect(user._id).toBe('user-id-123');
		expect(user.name).toBe('John');
		expect(user.lastName).toBe('Doe');
		expect(user.mail).toBe('john.doe@example.com');
	});

	it('should create a User instance without an _id', () => {
		const props: UserProps = {
			name: 'Jane',
			lastName: 'Smith',
			mail: 'jane.smith@example.com',
		};
		const user = new User(props);

		expect(user._id).toBeUndefined();
		expect(user.name).toBe('Jane');
		expect(user.lastName).toBe('Smith');
		expect(user.mail).toBe('jane.smith@example.com');
	});

	it('should create a User instance with empty string in _id', () => {
		const props: UserProps = {
			_id: '',
			name: 'Jane',
			lastName: 'Smith',
			mail: 'jane.smith@example.com',
		};
		const user = new User(props);

		expect(user._id).toBe('');
		expect(user.name).toBe('Jane');
		expect(user.lastName).toBe('Smith');
		expect(user.mail).toBe('jane.smith@example.com');
	});

	it('should create a User instance with different data', () => {
		const props: UserProps = {
			_id: 'user-id-456',
			name: 'Peter',
			lastName: 'Pan',
			mail: 'peter.pan@example.com',
		};
		const user = new User(props);

		expect(user._id).toBe('user-id-456');
		expect(user.name).toBe('Peter');
		expect(user.lastName).toBe('Pan');
		expect(user.mail).toBe('peter.pan@example.com');
	});
});
