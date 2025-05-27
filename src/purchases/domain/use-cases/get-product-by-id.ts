import { IProductService } from '../services/product-service';

export class GetProductById {
    constructor(private readonly ProductService: IProductService) {}

    async execute(productId: string): Promise<any> {
        return this.ProductService.getProductById(productId);
    }
}
