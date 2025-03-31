import { CreateUserDto } from '../dtos/create-user.dto';
import { UserDto } from '../dtos/user.dto';

export interface UserUseCase {
	createUser(createUserDto: CreateUserDto): Promise<UserDto>;
	getUserById(id: string): Promise<UserDto | null>;
	updateUser(id: string, updateUserDto: CreateUserDto): Promise<UserDto | null>;
	deleteUser(id: string): Promise<void>;
}