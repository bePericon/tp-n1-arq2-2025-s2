import { CreatePurchase } from '../../../domain/use-cases/create-purchase';
import { PurchaseDto } from '../../../application/dtos/purchase.dto';
import { Purchase } from '../../../domain/entities/purchase';
import { PurchaseRepository } from '../../../domain/repositories/purchase-repository';

// Mock the PurchaseRepository
class MockPurchaseRepository implements PurchaseRepository {
	save(purchaseDto: PurchaseDto): Promise<Purchase> {
		return Promise.resolve(
			new Purchase({
				_id: 'mocked-id', // Simulate an ID being generated on save
				userId: purchaseDto.userId,
				productId: purchaseDto.productId,
				quantity: purchaseDto.quantity,
				name: purchaseDto.name,
				description: purchaseDto.description,
				price: purchaseDto.price,
				sellerId: purchaseDto.sellerId
			})
		);
	}
	findById(id: string): Promise<Purchase | null> {
		throw new Error('Method not implemented.');
	}
	getById(id: string): Promise<Purchase | null> {
		throw new Error('Method not implemented.');
	}
	findAll(): Promise<Purchase[]> {
		throw new Error('Method not implemented.');
	}
	delete(id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
	update(id: string, purchaseDto: PurchaseDto): Promise<Purchase> {
		throw new Error('Method not implemented.');
	}
}

describe('CreatePurchase', () => {
	let createPurchase: CreatePurchase;
	let mockPurchaseRepository: MockPurchaseRepository;

	beforeEach(() => {
		mockPurchaseRepository = new MockPurchaseRepository();
		createPurchase = new CreatePurchase(mockPurchaseRepository);
	});

	it('should create a purchase successfully', async () => {
		const purchaseDto: PurchaseDto = {
			userId: 'user123',
			productId: 'product456',
			quantity: 2,
			name: 'Test Product',
			description: 'This is a test product',
			price: 10.99,
			sellerId: 'seller123'
		};

		const result = await createPurchase.execute(purchaseDto);

		expect(result).toBeInstanceOf(Purchase);
		expect(result._id).toBe('mocked-id');
		expect(result.userId).toBe('user123');
		expect(result.productId).toBe('product456');
		expect(result.quantity).toBe(2);
		expect(result.name).toBe('Test Product');
		expect(result.description).toBe('This is a test product');
		expect(result.price).toBe(10.99);
	});

	it('should handle different purchase data', async () => {
		const purchaseDto1: PurchaseDto = {
			userId: 'user789',
			productId: 'product101',
			quantity: 1,
			name: 'Another Product',
			description: 'Another description',
			price: 5.99,
			sellerId: 'seller123'
		};
		const purchaseDto2: PurchaseDto = {
			userId: 'user111',
			productId: 'product222',
			quantity: 5,
			name: 'Product 2',
			description: 'Description 2',
			price: 100,
			sellerId: 'seller1234'
		};

		const result1 = await createPurchase.execute(purchaseDto1);
		const result2 = await createPurchase.execute(purchaseDto2);

		expect(result1).toBeInstanceOf(Purchase);
		expect(result1._id).toBe('mocked-id');
		expect(result1.userId).toBe('user789');
		expect(result1.productId).toBe('product101');
		expect(result1.quantity).toBe(1);
		expect(result1.name).toBe('Another Product');
		expect(result1.description).toBe('Another description');
		expect(result1.price).toBe(5.99);

		expect(result2).toBeInstanceOf(Purchase);
		expect(result2._id).toBe('mocked-id');
		expect(result2.userId).toBe('user111');
		expect(result2.productId).toBe('product222');
		expect(result2.quantity).toBe(5);
		expect(result2.name).toBe('Product 2');
		expect(result2.description).toBe('Description 2');
		expect(result2.price).toBe(100);
	});

	it('should call the save method of the repository', async () => {
		const purchaseDto: PurchaseDto = {
			userId: 'user123',
			productId: 'product456',
			quantity: 2,
			name: 'Test Product',
			description: 'This is a test product',
			price: 10.99,
			sellerId: 'seller123'
		};
		const saveSpy = jest.spyOn(mockPurchaseRepository, 'save');

		await createPurchase.execute(purchaseDto);

		expect(saveSpy).toHaveBeenCalledTimes(1);
		expect(saveSpy).toHaveBeenCalledWith(purchaseDto);
	});
});
