import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user-repository';
import userModel from '../models/user.model';

export class MongoUserRepository implements UserRepository {
	async save(user: User): Promise<User> {
		const createdUser = new userModel({
			name: user.name,
			lastName: user.lastName,
			mail: user.mail,
		});
		await createdUser.save();
		return user;
	}

	async getById(id: string): Promise<User | null> {
		const user = await userModel.findById(id).exec();
		if (!user) return null;

		return new User({
			_id: user._id.toString(),
			name: user.name,
			lastName: user.lastName,
			mail: user.mail,
		});
	}

	async update(user: User): Promise<User> {
		await userModel
			.findByIdAndUpdate(
				user._id,
				{
					name: user.name,
					lastName: user.lastName,
					mail: user.mail,
					updatedAt: Date.now(),
				},
				{ new: true }
			)
			.exec();
		return user;
	}

	async delete(id: string): Promise<void> {
		await userModel.findByIdAndDelete(id).exec();
	}
}
