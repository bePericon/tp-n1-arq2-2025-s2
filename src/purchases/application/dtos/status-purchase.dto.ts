import { PurchaseDto } from "./purchase.dto"

export interface StatusPurchaseDto {
	existProduct: boolean
	hasStock: boolean
	purchase: PurchaseDto | null
}