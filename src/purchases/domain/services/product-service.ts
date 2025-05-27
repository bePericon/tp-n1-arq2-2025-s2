export interface IProductService {
	getProductById(productId: string): Promise<any>;
	decreaseStock(productId: string, quantity: number): Promise<boolean>;
}
