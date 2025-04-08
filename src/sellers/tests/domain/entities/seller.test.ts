import { Seller, SellerProps } from '../../../domain/entities/seller';

describe('Seller', () => {
	it('should create a Seller instance with all properties', () => {
		const props: SellerProps = {
			_id: 'seller-id-123',
			companyName: 'Acme Corp',
			mail: 'info@acme.com',
			products: ['product-id-1', 'product-id-2'],
		};
		const seller = new Seller(props);

		expect(seller._id).toBe('seller-id-123');
		expect(seller.companyName).toBe('Acme Corp');
		expect(seller.mail).toBe('info@acme.com');
		expect(seller.products).toEqual(['product-id-1', 'product-id-2']);
	});

	it('should create a Seller instance without an _id', () => {
		const props: SellerProps = {
			companyName: 'Widget Co',
			mail: 'contact@widgetco.com',
			products: [],
		};
		const seller = new Seller(props);

		expect(seller._id).toBeUndefined();
		expect(seller.companyName).toBe('Widget Co');
		expect(seller.mail).toBe('contact@widgetco.com');
		expect(seller.products).toEqual([]);
	});

	it('should create a Seller instance with empty string in _id', () => {
		const props: SellerProps = {
			_id: '',
			companyName: 'Widget Co',
			mail: 'contact@widgetco.com',
			products: [],
		};
		const seller = new Seller(props);

		expect(seller._id).toBe('');
		expect(seller.companyName).toBe('Widget Co');
		expect(seller.mail).toBe('contact@widgetco.com');
		expect(seller.products).toEqual([]);
	});

	it('should create a Seller instance with different data', () => {
		const props: SellerProps = {
			_id: 'seller-id-456',
			companyName: 'Example Inc',
			mail: 'support@example.com',
			products: ['product-id-3'],
		};
		const seller = new Seller(props);

		expect(seller._id).toBe('seller-id-456');
		expect(seller.companyName).toBe('Example Inc');
		expect(seller.mail).toBe('support@example.com');
		expect(seller.products).toEqual(['product-id-3']);
	});
});
