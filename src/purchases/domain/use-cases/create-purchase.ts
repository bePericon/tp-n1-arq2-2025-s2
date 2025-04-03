import { PurchaseDto } from "../../application/dtos/purchase.dto";
import { Purchase } from "../entities/purchase";
import { PurchaseRepository } from "../repositories/purchase-repository";

export class CreatePurchase {
	constructor(private readonly PurchaseRepository: PurchaseRepository) {}

	async execute(purchaseDto: PurchaseDto): Promise<Purchase> {
		return this.PurchaseRepository.save(purchaseDto);
	}
}
