import { User } from '../entities/user';
import { UserRepository } from '../repositories/user-repository';

export class CreateUser {
	constructor(private readonly UserRepository: UserRepository) {}

	async execute(
		name: string,
		lastName: string,
		mail: string
	): Promise<User> {
		const user = new User({ name, lastName, mail });
		return this.UserRepository.save(user);
	}
}
