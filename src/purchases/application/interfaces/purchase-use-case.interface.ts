import { CreatePurchaseDto } from "../dtos/create-purchase.dto";
import { StatusPurchaseDto } from "../dtos/status-purchase.dto";
import { PurchaseDto } from "../dtos/purchase.dto";

export interface PurchaseUseCase {
    createPurchase(createPurchaseDto: CreatePurchaseDto): Promise<StatusPurchaseDto>;
    getPurchaseById(id: string): Promise<PurchaseDto | null>;
}