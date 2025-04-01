import { Product } from '../../domain/entities/product';
import { ProductRepository } from '../../domain/repositories/product-repository';
import productModel from '../models/product.model';

export class MongoProductRepository implements ProductRepository {
	async save(product: Product): Promise<Product> {
		const createdProduct = new productModel({
			name: product.name,
			description: product.description,
			price: product.price,
			stock: product.stock,
			seller: product.sellerId,
		});

		const newProduct = await createdProduct.save();

		return new Product({
			...product,
			_id: newProduct._id.toString(),
		});
	}

	async getById(id: string): Promise<Product | null> {
		const product = await productModel.findById(id).exec();
		if (!product) return null;

		return new Product({
			_id: product._id.toString(),
			name: product.name,
			description: product.description,
			price: product.price,
			stock: product.stock,
			sellerId: product.seller ? product.seller._id.toString() : '',
		});
	}

	async update(product: Product): Promise<Product> {
		await productModel
			.findByIdAndUpdate(
				product._id,
				{
					name: product.name,
					description: product.description,
					price: product.price,
					stock: product.stock,
					seller: product.sellerId,
					updatedAt: Date.now(),
				},
				{ new: true }
			)
			.exec();
		return product;
	}

	async delete(id: string): Promise<void> {
		await productModel.findByIdAndDelete(id).exec();
	}
}
