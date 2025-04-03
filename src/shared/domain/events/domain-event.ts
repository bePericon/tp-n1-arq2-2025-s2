export abstract class DomainEvent<T> {
	public readonly eventName: string;
	public readonly payload: T;
	public readonly occurredOn: Date;

	protected constructor(eventName: string, payload: T) {
		this.eventName = eventName;
		this.payload = payload;
		this.occurredOn = new Date();
	}
}
