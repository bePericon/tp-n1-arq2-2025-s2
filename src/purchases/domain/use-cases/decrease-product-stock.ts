import { IProductService } from '../services/product-service';

export class DecreaseProductStock {
	constructor(private readonly ProductService: IProductService) {}

	async execute(productId: string, quantity: number): Promise<boolean> {
		return this.ProductService.decreaseStock(productId, quantity);
	}
}
