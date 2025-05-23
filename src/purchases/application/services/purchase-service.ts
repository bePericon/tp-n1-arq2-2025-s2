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
import { SendPurchaseEmail } from '../../domain/use-cases/send-purchase-email';
import { GetProductById } from '../../domain/use-cases/get-product-by-id';
import { IProductService } from '../../domain/services/product-service';
import { DecreaseProductStock } from '../../domain/use-cases/decrease-product-stock';

declare module 'axios' {
	export interface AxiosError {
		customData?: any; // Define customData como opcional (o con un tipo específico si lo conoces)
	}
}

export class PurchaseService implements PurchaseUseCase {
	private readonly createPurchaseUseCase: CreatePurchase;
	private readonly getPurchaseByIdUseCase: GetPurchaseById;
	private readonly sendPurchaseEmailUseCase: SendPurchaseEmail;
	private readonly getProductByIdUseCase: GetProductById;
	private readonly decreaseProductStockUseCase: DecreaseProductStock

	constructor(
		readonly purchaseRepository: PurchaseRepository,
		readonly emailService: IEmailService,
		readonly productService: IProductService
	) {
		this.createPurchaseUseCase = new CreatePurchase(purchaseRepository);
		this.getPurchaseByIdUseCase = new GetPurchaseById(purchaseRepository);
		this.sendPurchaseEmailUseCase = new SendPurchaseEmail(emailService);
		this.getProductByIdUseCase = new GetProductById(productService);
		this.decreaseProductStockUseCase = new DecreaseProductStock(productService);
	}

	async getPurchaseById(id: string): Promise<PurchaseDto | null> {
		const purchase = await this.getPurchaseByIdUseCase.execute(id);
		return purchase ? this.mapToPurchaseDto(purchase) : null;
	}

	async createPurchase(purchaseDto: CreatePurchaseDto): Promise<PurchaseDto> {
		// Verify user exist
		console.log(
			'Verificando URL usuario:',
			`${config.user_api_url}/${purchaseDto.userId}`
		);
		await axios.get(`${config.user_api_url}/${purchaseDto.userId}`);

		// Verify product exist and it have enough stock
		// const product = await new Promise<any>((resolve, reject) => {
		// 	productClient.GetProductById(
		// 		{ productId: purchaseDto.productId },
		// 		(error: any, response: any) => {
		// 			if (error) return reject(error);

		// 			resolve(response);
		// 		}
		// 	);
		// });
		const product = await this.getProductByIdUseCase.execute(purchaseDto.productId);
		console.log("🚀 ~ PurchaseService ~ createPurchase ~ product:", product)
		
		const createdPurchase = await this.createPurchaseUseCase.execute(
			new Purchase({
				userId: purchaseDto.userId,
				quantity: purchaseDto.quantity,
				productId: purchaseDto.productId,
				name: product.name,
				description: product.description,
				price: product.price,
				sellerId: product.sellerId,
			})
		);

		this.decreaseProductStockUseCase.execute(purchaseDto.productId, purchaseDto.quantity);
		// Update product stock
		// await new Promise<void>((resolve, reject) => {
		// 	productClient.DecreaseStock(
		// 		{ productId: purchaseDto.productId, quantity: purchaseDto.quantity },
		// 		(err: any, response: any) => {
		// 			if (err) return reject(err);
		// 			if (!response.success)
		// 				return reject(new Error('No se pudo decrementar el stock'));
		// 			resolve();
		// 		}
		// 	);
		// });

		const userEmail = 'brian.pericon@fravega.com.ar'; // User email
		const subject = 'Confirmación de Compra';
		const body = `Gracias por tu compra de ${purchaseDto.quantity} unidades del producto ${createdPurchase.name}.`;

		this.sendPurchaseEmailUseCase.execute(userEmail, subject, body);

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
