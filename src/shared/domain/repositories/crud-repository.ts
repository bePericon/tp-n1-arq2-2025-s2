export interface CRUDRepository<T> {
	save(entity: T): Promise<T>;
	getById(id: string): Promise<T | null>;
	update(entity: T): Promise<T>;
	delete(id: string): Promise<void>;
}
