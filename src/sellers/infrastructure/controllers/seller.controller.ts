import { Request, Response } from 'express';
import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { SellerService } from '../../application/services/seller-service';
import { MongoSellerRepository } from '../repositories/mongo-seller.repository';
import { CreateSellerDto } from '../../application/dtos/create-seller.dto';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import ApiResponse from '../../../shared/domain/value-objects/api-response';

@Controller('api/sellers')
export class SellerController {
	private readonly sellerService: SellerService;

	constructor() {
		const sellerRepository = new MongoSellerRepository();
		this.sellerService = new SellerService(sellerRepository);
	}

	@Post('')
	async createSeller(req: Request, res: Response): Promise<Response> {
		try {
			const createSellerDto: CreateSellerDto = req.body;
			const sellerDto = await this.sellerService.createSeller(createSellerDto);
			return res
				.status(StatusCodes.CREATED)
				.json(new ApiResponse('Vendedor creado', StatusCodes.CREATED, sellerDto));
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: 'Error creating seller' });
		}
	}

	@Get(':id')
	async getSellerById(req: Request, res: Response): Promise<Response> {
		try {
			if (mongoose.Types.ObjectId.isValid(req.params.id)) {
				const sellerId = req.params.id;
				const seller = await this.sellerService.getSellerById(sellerId);

				if (!seller) {
					return res
						.status(StatusCodes.NOT_FOUND)
						.json(
							new ApiResponse(
								'Vendedor no encontrado',
								StatusCodes.NOT_FOUND,
								seller
							)
						);
				}

				return res
					.status(StatusCodes.OK)
					.json(new ApiResponse('Vendedor encontrado', StatusCodes.OK, seller));
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
	async updateSeller(req: Request, res: Response): Promise<Response> {
		try {
			if (mongoose.Types.ObjectId.isValid(req.params.id)) {
				const sellerId = req.params.id;
				const updateSellerDto: CreateSellerDto = req.body;
				const seller = await this.sellerService.updateSeller(sellerId, updateSellerDto);

				if (!seller) {
					return res
						.status(StatusCodes.NOT_FOUND)
						.json(
							new ApiResponse(
								'Vendedor no encontrado',
								StatusCodes.NOT_FOUND,
								seller
							)
						);
				}

				return res
					.status(StatusCodes.OK)
					.json(new ApiResponse('Vendedor actualizado', StatusCodes.OK, seller));
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
			return res.status(500).send({ message: 'Error updating seller' });
		}
	}

	@Delete(':id')
	async deleteSeller(req: Request, res: Response): Promise<Response> {
		try {
			if (mongoose.Types.ObjectId.isValid(req.params.id)) {
				const sellerId = req.params.id;
				await this.sellerService.deleteSeller(sellerId);

				return res
					.status(StatusCodes.OK)
					.json(new ApiResponse('Vendedor eliminado', StatusCodes.OK, null));
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
			return res.status(500).send({ message: 'Error deleting seller' });
		}
	}
}
