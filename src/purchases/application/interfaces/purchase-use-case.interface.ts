import { CreatePurchaseDto } from "../dtos/create-purchase.dto";
import { PurchaseDto } from "../dtos/purchase.dto";

export interface PurchaseUseCase {
    createPurchase(createPurchaseDto: CreatePurchaseDto): Promise<PurchaseDto>;
    getPurchaseById(id: string): Promise<PurchaseDto | null>;
}