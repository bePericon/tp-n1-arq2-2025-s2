import { User } from '../entities/user';
import { UserRepository } from '../repositories/user-repository';

export class UpdateUser {
	constructor(private readonly UserRepository: UserRepository) {}

	async execute(user: User): Promise<User> {
		return this.UserRepository.update(user);
	}
}
