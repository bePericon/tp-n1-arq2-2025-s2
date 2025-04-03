export interface PurchaseDto {
    purchaseId?: string;
    productId: string;
	name: string;
	description: string;
	price: number;
	userId: string;
	quantity: number;
}