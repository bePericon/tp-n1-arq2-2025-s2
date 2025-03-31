import { Request, Response } from 'express';
import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { UserService } from '../../application/services/user-service';
import { MongoUserRepository } from '../repositories/mongo-user.repository';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../domain/value-objects/api-response';
import mongoose from 'mongoose';

@Controller('api/users')
export class UserController {
	private readonly userService: UserService;

	constructor() {
		// Inyección de dependencias (adaptador del repositorio)
		const userRepository = new MongoUserRepository();
		this.userService = new UserService(userRepository);
	}

	@Post('')
	async createUser(req: Request, res: Response): Promise<Response> {
		try {
			const createUserDto: CreateUserDto = req.body;
			const userDto = await this.userService.createUser(createUserDto);
			return res
				.status(StatusCodes.CREATED)
				.json(new ApiResponse('Usuario creado', StatusCodes.CREATED, userDto));
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: 'Error creating user' });
		}
	}

	@Get(':id')
	async getUserById(req: Request, res: Response): Promise<Response> {
		try {
			if (mongoose.Types.ObjectId.isValid(req.params.id)) {
				const userId = req.params.id;
				const user = await this.userService.getUserById(userId);

				if (!user) {
					return res
						.status(StatusCodes.NOT_FOUND)
						.json(
							new ApiResponse(
								'Usuario no encontrado',
								StatusCodes.NOT_FOUND,
								user
							)
						);
				}

				return res
					.status(StatusCodes.OK)
					.json(new ApiResponse('Usuario encontrado', StatusCodes.OK, user));
			}

			return res
				.status(StatusCodes.BAD_REQUEST)
				.json(
					new ApiResponse(
						'Formato de Id incorrecto',
						StatusCodes.BAD_REQUEST,
						null
					)
				);
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: 'Error fetching tasks' });
		}
	}

	@Put(':id')
	async updateUser(req: Request, res: Response): Promise<Response> {
		try {
			if (mongoose.Types.ObjectId.isValid(req.params.id)) {
				const userId = req.params.id;
				const updateUserDto: CreateUserDto = req.body;
				const user = await this.userService.updateUser(userId, updateUserDto);

				if (!user) {
					return res
						.status(StatusCodes.NOT_FOUND)
						.json(
							new ApiResponse(
								'Usuario no encontrado',
								StatusCodes.NOT_FOUND,
								user
							)
						);
				}

				return res
					.status(StatusCodes.OK)
					.json(new ApiResponse('Usuario actualizado', StatusCodes.OK, user));
			}

			return res
				.status(StatusCodes.BAD_REQUEST)
				.json(
					new ApiResponse(
						'Formato de Id incorrecto',
						StatusCodes.BAD_REQUEST,
						null
					)
				);
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: 'Error updating user' });
		}
	}

	@Delete(':id')
	async deleteUser(req: Request, res: Response): Promise<Response> {
		try {
			if (mongoose.Types.ObjectId.isValid(req.params.id)) {
				const userId = req.params.id;
				await this.userService.deleteUser(userId);

				return res
					.status(StatusCodes.OK)
					.json(new ApiResponse('Usuario eliminado', StatusCodes.OK, null));
			}

			return res
				.status(StatusCodes.BAD_REQUEST)
				.json(
					new ApiResponse(
						'Formato de Id incorrecto',
						StatusCodes.BAD_REQUEST,
						null
					)
				);
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: 'Error deleting user' });
		}
	}
}
