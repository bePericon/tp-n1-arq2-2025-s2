import { User } from '../entities/user';

export interface UserRepository {
	save(User: User): Promise<User>;
	getUserById(id: string): Promise<User | null>;
	update(User: User): Promise<User>;
	delete(id: string): Promise<void>;
}
