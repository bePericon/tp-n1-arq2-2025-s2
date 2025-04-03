import { EventEmitter } from 'events';
import { DomainEvent } from '../../domain/events/domain-event';

class EventBus extends EventEmitter {
	publish(event: DomainEvent<any>): void {
		console.log(`[EventBus] Publishing event: ${event.eventName}`, event.payload);
		this.emit(event.eventName, event);
	}

	subscribe(eventName: string, handler: (event: DomainEvent<any>) => void): void {
		console.log(`[EventBus] Subscribing handler to event: ${eventName}`);
		this.on(eventName, handler);
	}
}

export const eventBus = new EventBus();
