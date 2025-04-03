export interface CreatePurchaseDto {
	productId: string;
	name: string;
	description: string;
	price: number;
	userId: string;
	quantity: number;
}
