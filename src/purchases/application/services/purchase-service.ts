import axios from 'axios';
import { Purchase } from '../../domain/entities/purchase';
import { PurchaseRepository } from '../../domain/repositories/purchase-repository';
import { CreatePurchase } from '../../domain/use-cases/create-purchase';
import { CreatePurchaseDto } from '../dtos/create-purchase.dto';
import { PurchaseDto } from '../dtos/purchase.dto';
import { PurchaseUseCase } from '../interfaces/purchase-use-case.interface';
import config from '../../../config/config';
import { GetPurchaseById } from '../../domain/use-cases/get-purchase-by-id';
import { IEmailService } from '../../domain/services/email-service';
import { productClient  } from '../../infrastructure/services/product-grpc-client';

declare module 'axios' {
	export interface AxiosError {
		customData?: any; // Define customData como opcional (o con un tipo específico si lo conoces)
	}
}

export class PurchaseService implements PurchaseUseCase {
	private readonly createPurchaseUseCase: CreatePurchase;
	private readonly getPurchaseByIdUseCase: GetPurchaseById;
	private readonly emailService: IEmailService;

	constructor(
		readonly purchaseRepository: PurchaseRepository,
		readonly eService: IEmailService
	) {
		this.createPurchaseUseCase = new CreatePurchase(purchaseRepository);
		this.getPurchaseByIdUseCase = new GetPurchaseById(purchaseRepository);
		this.emailService = eService;
	}

	async getPurchaseById(id: string): Promise<PurchaseDto | null> {
		const purchase = await this.getPurchaseByIdUseCase.execute(id);
		return purchase ? this.mapToPurchaseDto(purchase) : null;
	}

	

	

	async createPurchase(purchaseDto: CreatePurchaseDto): Promise<PurchaseDto> {
		// Verify user exist
		console.log('Verificando URL usuario:', `${config.user_api_url}/${purchaseDto.userId}`);
		await axios.get(`${config.user_api_url}/${purchaseDto.userId}`);

		// TODO: connection with other service implementing RPC (gRPC)
		// Verify product exist and it have enough stock
		// const {
		// 	data: { data: product },
		// } = await axios.get(
		// 	`${config.product_api_url}/${purchaseDto.productId}?quantity=${purchaseDto.quantity}`
		// );

		// Update product stock
		// await axios.put(`${config.product_api_url}/${purchaseDto.productId}`, {
		// 	quantity: purchaseDto.quantity,
		// });
		console.log(purchaseDto.productId)
		const product = await new Promise<any>((resolve, reject) => {
			productClient.GetProductById({ productId: purchaseDto.productId }, (error: any, response: any) => {
				if (error) return reject(error);
				
				resolve(response);
			});
		});
		console.log(product)
		const createdPurchase = await this.createPurchaseUseCase.execute(
			new Purchase({
				userId: purchaseDto.userId,
				quantity: purchaseDto.quantity,
				productId: purchaseDto.productId,
				name: product.name,
				description: product.description,
				price: product.price,
				sellerId: product.sellerId
			})
		);

		// Publish created purchase event
		// eventBus.publish(
		// 	new PurchaseCreatedEvent({
		// 		productId: purchaseDto.productId,
		// 		quantity: purchaseDto.quantity,
		// 	})
		// );

		// Decrementar stock vía gRPC
		await new Promise<void>((resolve, reject) => {
			productClient.DecreaseStock(
				{ productId: purchaseDto.productId, quantity: purchaseDto.quantity },
				(err: any, response: any) => {
					if (err) return reject(err);
					if (!response.success) return reject(new Error('No se pudo decrementar el stock'));
					resolve();
				}
			);
		});

		const userEmail = 'jeremiasfuentes77@gmail.com'; // User email
		const subject = 'Confirmación de Compra';
		const body = `Gracias por tu compra de ${purchaseDto.quantity} unidades del producto ${purchaseDto.productId}.`;

		this.emailService.sendPurchaseConfirmationEmail(userEmail, subject, body);

		return this.mapToPurchaseDto(createdPurchase);
	}

	private mapToPurchaseDto(product: Purchase): PurchaseDto {
		return {
			purchaseId: product._id,
			quantity: product.quantity,
			userId: product.userId,

			productId: product.productId,
			name: product.name,
			description: product.description,
			price: product.price,
			sellerId: product.sellerId,
		};
	}
}
