import { Purchase, PurchaseProps } from '../../../domain/entities/purchase';

describe('Purchase', () => {
	it('should create a Purchase instance with valid props', () => {
		const props: PurchaseProps = {
			userId: 'user123',
			productId: 'product456',
			quantity: 2,
			name: 'Test Product',
			description: 'This is a test product',
			price: 10.99,
		};

		const purchase = new Purchase(props);

		expect(purchase).toBeInstanceOf(Purchase);
		expect(purchase.userId).toBe('user123');
		expect(purchase.productId).toBe('product456');
		expect(purchase.quantity).toBe(2);
		expect(purchase.name).toBe('Test Product');
		expect(purchase.description).toBe('This is a test product');
		expect(purchase.price).toBe(10.99);
		expect(purchase._id).toBeUndefined();
	});

	it('should create a Purchase instance with an _id', () => {
		const props: PurchaseProps = {
			_id: 'purchase789',
			userId: 'user123',
			productId: 'product456',
			quantity: 2,
			name: 'Test Product',
			description: 'This is a test product',
			price: 10.99,
		};

		const purchase = new Purchase(props);

		expect(purchase).toBeInstanceOf(Purchase);
		expect(purchase._id).toBe('purchase789');
		expect(purchase.userId).toBe('user123');
		expect(purchase.productId).toBe('product456');
		expect(purchase.quantity).toBe(2);
		expect(purchase.name).toBe('Test Product');
		expect(purchase.description).toBe('This is a test product');
		expect(purchase.price).toBe(10.99);
	});

	it('should handle different quantity values', () => {
		const props1: PurchaseProps = {
			userId: 'user123',
			productId: 'product456',
			quantity: 1,
			name: 'Test Product',
			description: 'This is a test product',
			price: 10.99,
		};
		const props2: PurchaseProps = {
			userId: 'user123',
			productId: 'product456',
			quantity: 5,
			name: 'Test Product',
			description: 'This is a test product',
			price: 10.99,
		};
		const props3: PurchaseProps = {
			userId: 'user123',
			productId: 'product456',
			quantity: 0,
			name: 'Test Product',
			description: 'This is a test product',
			price: 10.99,
		};

		const purchase1 = new Purchase(props1);
		const purchase2 = new Purchase(props2);
		const purchase3 = new Purchase(props3);

		expect(purchase1.quantity).toBe(1);
		expect(purchase2.quantity).toBe(5);
		expect(purchase3.quantity).toBe(0);
	});

	it('should handle different price values', () => {
		const props1: PurchaseProps = {
			userId: 'user123',
			productId: 'product456',
			quantity: 1,
			name: 'Test Product',
			description: 'This is a test product',
			price: 0,
		};
		const props2: PurchaseProps = {
			userId: 'user123',
			productId: 'product456',
			quantity: 5,
			name: 'Test Product',
			description: 'This is a test product',
			price: 100,
		};
		const props3: PurchaseProps = {
			userId: 'user123',
			productId: 'product456',
			quantity: 0,
			name: 'Test Product',
			description: 'This is a test product',
			price: 99.99,
		};

		const purchase1 = new Purchase(props1);
		const purchase2 = new Purchase(props2);
		const purchase3 = new Purchase(props3);

		expect(purchase1.price).toBe(0);
		expect(purchase2.price).toBe(100);
		expect(purchase3.price).toBe(99.99);
	});
});
