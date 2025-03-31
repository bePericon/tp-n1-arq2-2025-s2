import { User } from '../entities/user';
// import { UserId } from '../value-objects/user-id';

export interface UserRepository {
	save(User: User): Promise<User>;
	getUserById(id: string): Promise<User | null>;
	update(User: User): Promise<User>;
	delete(id: string): Promise<void>;
}
