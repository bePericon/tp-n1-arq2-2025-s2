import { User } from '../entities/user';
import { UserRepository } from '../repositories/user-repository';

export class GetUserById {
	constructor(private readonly UserRepository: UserRepository) {}

	async execute(id: string): Promise<User | null> {
		return this.UserRepository.getById(id);
	}
}
