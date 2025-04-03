import { PurchaseCreatedEvent } from '../../../purchases/domain/events/purchase-created.event';
import { eventBus } from '../../../shared/infrastructure/event-bus/event-bus';
import { ProductService } from '../../application/services/product-service';
import { MongoProductRepository } from '../repositories/mongo-product.repository';

export class PurchaseCreatedHandler {
	private readonly productService: ProductService;

	constructor() {
		const productRepository = new MongoProductRepository();
		this.productService = new ProductService(productRepository);

		eventBus.subscribe(PurchaseCreatedEvent.EVENT_NAME, this.handle.bind(this));
	}

	async handle(event: PurchaseCreatedEvent): Promise<void> {
		const { productId, quantity } = event.payload;

		await this.productService.decreaseStock(productId, quantity);
		console.log(
			`[PurchaseCreatedHandler] Stock decreased for product ${productId} by ${quantity}`
		);
	}
}

new PurchaseCreatedHandler();
