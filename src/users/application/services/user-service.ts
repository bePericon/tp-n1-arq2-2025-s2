import { CreateUser } from '../../domain/use-cases/create-user';
import { User } from '../../domain/entities/user';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserDto } from '../dtos/user.dto';
import { UserUseCase } from '../interfaces/user-use-case.interface';
import { UserRepository } from '../../domain/repositories/user-repository';
import { GetUserById } from '../../domain/use-cases/get-user-by-id';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UpdateUser } from '../../domain/use-cases/update-user';
import { DeleteUser } from '../../domain/use-cases/delete-user';

export class UserService implements UserUseCase {
	private readonly createUserUseCase: CreateUser;
	private readonly getUserByIdUseCase: GetUserById;
	private readonly updateUserUseCase: UpdateUser;
	private readonly deleteUserUseCase: DeleteUser;

	constructor(readonly userRepository: UserRepository) {
		this.createUserUseCase = new CreateUser(userRepository);
		this.getUserByIdUseCase = new GetUserById(userRepository);
		this.updateUserUseCase = new UpdateUser(userRepository);
		this.deleteUserUseCase = new DeleteUser(userRepository);
	}

	async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
		const user = await this.createUserUseCase.execute(
			createUserDto.name,
			createUserDto.lastName,
			createUserDto.mail
		);
		return this.mapToUserDto(user);
	}

	async getUserById(id: string): Promise<UserDto | null> {
		const user = await this.getUserByIdUseCase.execute(id);
		return user ? this.mapToUserDto(user) : null;
	}

	async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto | null> {
		const user = await this.updateUserUseCase.execute(
			new User({ _id: id, ...updateUserDto })
		);
		return user ? this.mapToUserDto(user) : null;
	}

	async deleteUser(id: string): Promise<void> {
		await this.deleteUserUseCase.execute(id);
	}

	private mapToUserDto(user: User): UserDto {
		return {
			userId: user._id,
			name: user.name,
			lastName: user.lastName,
			mail: user.mail,
		};
	}
}
