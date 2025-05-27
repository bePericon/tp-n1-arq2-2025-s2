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
import { StatusPurchaseDto } from '../dtos/status-purchase.dto';

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
	private readonly decreaseProductStockUseCase: DecreaseProductStock;

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

	async createPurchase(purchaseDto: CreatePurchaseDto): Promise<StatusPurchaseDto> {
		// Verify user exist
		const {
			data: { data: user },
		} = await axios.get(`${config.user_api_url}/${purchaseDto.userId}`);

		// Verify product exist and enough stock
		const product = await this.getProductByIdUseCase.execute(purchaseDto.productId);
		if (!product) {
			return this.mapToStatusPurchaseDto(false, false, null);
		}
		const hasStock = product.stock >= purchaseDto.quantity;
		if (!hasStock) {
			return this.mapToStatusPurchaseDto(true, false, null);
		}

		// Create purchase
		const createdPurchase = await this.createPurchaseUseCase.execute(
			new Purchase({
				userId: purchaseDto.userId,
				quantity: purchaseDto.quantity,
				productId: purchaseDto.productId,
				name: product.name,
				description: product.description,
				price: product.price,
				sellerId: product.sellerId,
				sellerName: product.sellerName,
			})
		);

		this.decreaseProductStockUseCase.execute(
			purchaseDto.productId,
			purchaseDto.quantity
		);

		const userEmail = user.mail;
		const subjectForUser = 'Confirmación de Compra';
		const bodyForUser = `Gracias por tu compra de ${purchaseDto.quantity} unidades del producto ${createdPurchase.name}.`;

		const sellerEmail = product.sellerMail;
		const subjectForSeller = 'Confirmación de Venta';
		const bodyForSeller = `Se efectuó la compra del producto: ${createdPurchase.name}, en unidades: ${purchaseDto.quantity}.`;

		this.sendPurchaseEmailUseCase.execute(userEmail, subjectForUser, bodyForUser);
		this.sendPurchaseEmailUseCase.execute(
			sellerEmail,
			subjectForSeller,
			bodyForSeller
		);

		return this.mapToStatusPurchaseDto(
			true,
			true,
			this.mapToPurchaseDto(createdPurchase)
		);
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
			sellerName: product.sellerName,
		};
	}

	private mapToStatusPurchaseDto(
		existProduct: boolean,
		hasStock: boolean,
		purchaseDto: PurchaseDto | null
	): StatusPurchaseDto {
		return {
			existProduct,
			hasStock,
			purchase: purchaseDto,
		};
	}
}
