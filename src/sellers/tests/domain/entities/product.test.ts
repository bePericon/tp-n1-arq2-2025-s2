import { Product, ProductProps } from '../../../domain/entities/product';

describe('Product', () => {
	it('should create a Product instance with all properties', () => {
		const props: ProductProps = {
			_id: 'product-id-123',
			name: 'Laptop',
			description: 'High-performance laptop',
			price: 1200,
			stock: 10,
			sellerId: 'seller-id-456',
		};
		const product = new Product(props);

		expect(product._id).toBe('product-id-123');
		expect(product.name).toBe('Laptop');
		expect(product.description).toBe('High-performance laptop');
		expect(product.price).toBe(1200);
		expect(product.stock).toBe(10);
		expect(product.sellerId).toBe('seller-id-456');
	});

	it('should create a Product instance without an _id', () => {
		const props: ProductProps = {
			name: 'Mouse',
			description: 'Wireless mouse',
			price: 25,
			stock: 50,
			sellerId: 'seller-id-456',
		};
		const product = new Product(props);

		expect(product._id).toBeUndefined();
		expect(product.name).toBe('Mouse');
		expect(product.description).toBe('Wireless mouse');
		expect(product.price).toBe(25);
		expect(product.stock).toBe(50);
		expect(product.sellerId).toBe('seller-id-456');
	});

	it('should decrease the stock of a product', () => {
		const props: ProductProps = {
			name: 'Keyboard',
			description: 'Mechanical keyboard',
			price: 100,
			stock: 20,
			sellerId: 'seller-id-456',
		};
		const product = new Product(props);

		product.decrease(5);
		expect(product.stock).toBe(15);
	});

	it('should decrease the stock of a product with different quantity', () => {
		const props: ProductProps = {
			name: 'Monitor',
			description: '4k monitor',
			price: 300,
			stock: 10,
			sellerId: 'seller-id-456',
		};
		const product = new Product(props);

		product.decrease(10);
		expect(product.stock).toBe(0);
	});

	it('should create a Product instance with empty string in _id', () => {
		const props: ProductProps = {
			_id: '',
			name: 'Monitor',
			description: '4k monitor',
			price: 300,
			stock: 10,
			sellerId: 'seller-id-456',
		};
		const product = new Product(props);

		expect(product._id).toBe('');
		expect(product.name).toBe('Monitor');
		expect(product.description).toBe('4k monitor');
		expect(product.price).toBe(300);
		expect(product.stock).toBe(10);
		expect(product.sellerId).toBe('seller-id-456');
	});
});
