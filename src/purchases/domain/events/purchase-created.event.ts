import { DomainEvent } from '../../../shared/domain/events/domain-event';

interface PurchaseCreatedPayload {
	productId: string;
    quantity: number;
}

export class PurchaseCreatedEvent extends DomainEvent<PurchaseCreatedPayload> {
	static EVENT_NAME = 'purchase.created';

	constructor(payload: PurchaseCreatedPayload) {
		super(PurchaseCreatedEvent.EVENT_NAME, payload);
	}
}
