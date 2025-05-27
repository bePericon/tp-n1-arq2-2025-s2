export interface PurchaseDto {
    purchaseId?: string;
	userId: string;
	quantity: number;

	productId: string;
	name: string;
	description: string;
	price: number;
	sellerId: string;
	sellerName: string
}