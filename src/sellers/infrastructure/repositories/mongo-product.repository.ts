import { Product } from '../../domain/entities/product';
import { ProductRepository } from '../../domain/repositories/product-repository';
import { PriceFilter } from '../../domain/use-cases/filter-products-by-price';
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

		return this.mapModelToProduct(product);
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

	async findByName(name: string): Promise<Product[]> {
		const products = await productModel
			.find({ name: { $regex: name, $options: 'i' } })
			.exec();

		return products.map((product) => this.mapModelToProduct(product));
	}

	async findByPriceRange(filters: PriceFilter): Promise<Product[]> {
		const query: any = {};

		if (filters.greaterThan !== undefined) {
			query.price = { $gt: filters.greaterThan };
		} else if (filters.lessThan !== undefined) {
			query.price = { $lt: filters.lessThan };
		} else if (filters.min !== undefined && filters.max !== undefined) {
			query.price = { $gte: filters.min, $lte: filters.max };
		} else if (filters.min !== undefined) {
			query.price = { $gte: filters.min };
		} else if (filters.max !== undefined) {
			query.price = { $lte: filters.max };
		}

		const products = await productModel.find(query).exec();

		return products.map((product) => this.mapModelToProduct(product));
	}

	mapModelToProduct(product: any): Product {
		return new Product({
			_id: product._id.toString(),
			name: product.name,
			description: product.description,
			price: product.price,
			stock: product.stock,
			sellerId: product.seller ? product.seller._id.toString() : '',
		});
	}
}
