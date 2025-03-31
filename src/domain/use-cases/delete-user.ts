import { UserRepository } from '../repositories/user-repository';

export class DeleteUser {
	constructor(private readonly UserRepository: UserRepository) {}

	async execute(id: string): Promise<void> {
		return this.UserRepository.delete(id);
	}
}
