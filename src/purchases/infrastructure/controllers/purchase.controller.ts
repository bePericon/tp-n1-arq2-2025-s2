import { Request, Response } from 'express';
import { Controller, Post,  } from '@overnightjs/core';
import { PurchaseService } from '../../application/services/purchase-service';
import { CreatePurchaseDto } from '../../application/dtos/create-purchase.dto';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../../shared/domain/value-objects/api-response';
import { MongoPurchaseRepository } from '../repositories/mongo-purchase.repository';

@Controller('api/purchases')
export class PurchaseController {
	private readonly purchaseProduct: PurchaseService;

	constructor() {
		const purchaseRepository = new MongoPurchaseRepository();
		this.purchaseProduct = new PurchaseService(purchaseRepository);
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
