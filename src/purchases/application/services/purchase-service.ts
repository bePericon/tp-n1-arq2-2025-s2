import axios, { AxiosError } from 'axios';
import { Purchase } from '../../domain/entities/purchase';
import { PurchaseRepository } from '../../domain/repositories/purchase-repository';
import { CreatePurchase } from '../../domain/use-cases/create-purchase';
import { CreatePurchaseDto } from '../dtos/create-purchase.dto';
import { PurchaseDto } from '../dtos/purchase.dto';
import { PurchaseUseCase } from '../interfaces/purchase-use-case.interface';
import config from '../../../config/config';
import { eventBus } from '../../../shared/infrastructure/event-bus/event-bus';
import { PurchaseCreatedEvent } from '../../domain/events/purchase-created.event';

declare module 'axios' {
	export interface AxiosError {
		customData?: any; // Define customData como opcional (o con un tipo específico si lo conoces)
	}
}

export class PurchaseService implements PurchaseUseCase {
	private readonly createPurchaseUseCase: CreatePurchase;

	constructor(readonly purchaseRepository: PurchaseRepository) {
		this.createPurchaseUseCase = new CreatePurchase(purchaseRepository);
	}

	async createPurchase(purchaseDto: CreatePurchaseDto): Promise<PurchaseDto> {
		// Verify user exist
		await axios.get(`${config.user_api_url}/${purchaseDto.userId}`);

		// Verify product exist and it have enough stock
		await axios.post(`${config.product_api_url}/${purchaseDto.productId}/purchase`, {
			quantity: purchaseDto.quantity,
		});

		const createdPurchase = await this.createPurchaseUseCase.execute(
			new Purchase({
				productId: purchaseDto.productId,
				name: purchaseDto.name,
				description: purchaseDto.description,
				price: purchaseDto.price,
				quantity: purchaseDto.quantity,
				userId: purchaseDto.userId,
			})
		);

		// Publish created purchase event
		eventBus.publish(
			new PurchaseCreatedEvent({
				productId: purchaseDto.productId,
				quantity: purchaseDto.quantity,
			})
		);

		return this.mapToPurchaseDto(createdPurchase);
	}

	private mapToPurchaseDto(product: Purchase): PurchaseDto {
		return {
			purchaseId: product._id,
			productId: product.productId,
			name: product.name,
			description: product.description,
			price: product.price,
			quantity: product.quantity,
			userId: product.userId,
		};
	}
}
