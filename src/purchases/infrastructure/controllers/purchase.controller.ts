import { Request, Response } from 'express';
import { Controller, Get, Post } from '@overnightjs/core';
import { PurchaseService } from '../../application/services/purchase-service';
import { CreatePurchaseDto } from '../../application/dtos/create-purchase.dto';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../../shared/domain/value-objects/api-response';
import { MongoPurchaseRepository } from '../repositories/mongo-purchase.repository';
import mongoose from 'mongoose';
import { GrpcEmailService } from '../services/grpc-email.service';
import { GrpcProductService } from '../services/grpc-product.service';

@Controller('api/purchases')
export class PurchaseController {
	private readonly purchaseProduct: PurchaseService;

	constructor() {
		const purchaseRepository = new MongoPurchaseRepository();

		const NOTIFICATION_SERVICE_ADDRESS = 'localhost:50053';
		const emailService = new GrpcEmailService(NOTIFICATION_SERVICE_ADDRESS);
		const SELLERS_SERVICE_ADDRESS = 'localhost:50051';
		const productService = new GrpcProductService(SELLERS_SERVICE_ADDRESS);

		this.purchaseProduct = new PurchaseService(purchaseRepository, emailService, productService);
	}

	@Get(':id')
	async getPurchaseById(req: Request, res: Response): Promise<Response> {
		if (mongoose.Types.ObjectId.isValid(req.params.id)) {
			const purchaseId = req.params.id;
			const purchase = await this.purchaseProduct.getPurchaseById(purchaseId);

			if (!purchase) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json(
						new ApiResponse(
							'Compra no encontrada',
							StatusCodes.NOT_FOUND,
							purchase
						)
					);
			}

			return res
				.status(StatusCodes.OK)
				.json(new ApiResponse('Compra encontrada', StatusCodes.OK, purchase));
		}

		return res
			.status(StatusCodes.BAD_REQUEST)
			.json(
				new ApiResponse('Formato de Id incorrecto', StatusCodes.BAD_REQUEST, null)
			);
	}

	@Post('')
	async createPurchase(req: Request, res: Response): Promise<Response> {
		const purchaseDto: CreatePurchaseDto = req.body;

		const purchase = await this.purchaseProduct.createPurchase(purchaseDto);

		return res
			.status(StatusCodes.OK)
			.json(new ApiResponse('Producto comprado', StatusCodes.OK, purchase));
	}
}
