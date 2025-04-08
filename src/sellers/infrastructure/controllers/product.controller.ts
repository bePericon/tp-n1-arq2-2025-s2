import { Request, Response } from 'express';
import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { ProductService } from '../../application/services/product-service';
import { MongoProductRepository } from '../repositories/mongo-product.repository';
import { CreateProductDto } from '../../application/dtos/create-product.dto';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import ApiResponse from '../../../shared/domain/value-objects/api-response';
import { SellerService } from '../../application/services/seller-service';
import { MongoSellerRepository } from '../repositories/mongo-seller.repository';
import '../event-handlers/purchase-created.handler';
import { PriceFilter } from '../../domain/use-cases/filter-products-by-price';

@Controller('api/products')
export class ProductController {
	private readonly productService: ProductService;
	private readonly sellerService: SellerService;

	constructor() {
		const productRepository = new MongoProductRepository();
		this.productService = new ProductService(productRepository);

		const sellerRepository = new MongoSellerRepository();
		this.sellerService = new SellerService(sellerRepository);
	}

	@Post('')
	async createProduct(req: Request, res: Response): Promise<Response> {
		const createProductDto: CreateProductDto = req.body;
		const productDto = await this.productService.createProduct(createProductDto);
		await this.sellerService.addProductToSeller(
			productDto.sellerId,
			productDto.productId as string
		);
		return res
			.status(StatusCodes.CREATED)
			.json(new ApiResponse('Producto creado', StatusCodes.CREATED, productDto));
	}

	@Get('search')
	async searchProducts(req: Request, res: Response): Promise<Response> {
		const name = req.query.name as string;
		const products = await this.productService.searchProductsByName(name);

		let textResponse = 'Productos encontrados';
		if (products.length === 0) textResponse = 'No se ha encontrado ningún producto';

		return res
			.status(StatusCodes.OK)
			.json(new ApiResponse(textResponse, StatusCodes.OK, products));
	}

	@Get('filter')
	async filterProductsByPrice(req: Request, res: Response): Promise<Response> {
		const filters: PriceFilter = {};

		if (req.query.greaterThan) {
			filters.greaterThan = parseFloat(req.query.greaterThan as string);
		}
		if (req.query.lessThan) {
			filters.lessThan = parseFloat(req.query.lessThan as string);
		}
		if (req.query.min) {
			filters.min = parseFloat(req.query.min as string);
		}
		if (req.query.max) {
			filters.max = parseFloat(req.query.max as string);
		}

		const products = await this.productService.filterProductsByPrice(filters);

		let textResponse = 'Productos encontrados';
		if (products.length === 0) textResponse = 'No se ha encontrado ningún producto';

		return res
			.status(StatusCodes.OK)
			.json(new ApiResponse(textResponse, StatusCodes.OK, products));
	}

	@Get(':id')
	async getProductById(req: Request, res: Response): Promise<Response> {
		if (mongoose.Types.ObjectId.isValid(req.params.id)) {
			const productId = req.params.id;
			const product = await this.productService.getProductById(productId);

			if (!product) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json(
						new ApiResponse(
							'Producto no encontrado',
							StatusCodes.NOT_FOUND,
							product
						)
					);
			}

			return res
				.status(StatusCodes.OK)
				.json(new ApiResponse('Producto encontrado', StatusCodes.OK, product));
		}

		return res
			.status(StatusCodes.BAD_REQUEST)
			.json(
				new ApiResponse('Formato de Id incorrecto', StatusCodes.BAD_REQUEST, null)
			);
	}

	@Put(':id')
	async updateProduct(req: Request, res: Response): Promise<Response> {
		if (mongoose.Types.ObjectId.isValid(req.params.id)) {
			const productId = req.params.id;
			const updateProductDto: CreateProductDto = req.body;
			const product = await this.productService.updateProduct(
				productId,
				updateProductDto
			);

			if (!product) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json(
						new ApiResponse(
							'Producto no encontrado',
							StatusCodes.NOT_FOUND,
							product
						)
					);
			}

			return res
				.status(StatusCodes.OK)
				.json(new ApiResponse('Producto actualizado', StatusCodes.OK, product));
		}

		return res
			.status(StatusCodes.BAD_REQUEST)
			.json(
				new ApiResponse('Formato de Id incorrecto', StatusCodes.BAD_REQUEST, null)
			);
	}

	@Delete(':id')
	async deleteProduct(req: Request, res: Response): Promise<Response> {
		if (mongoose.Types.ObjectId.isValid(req.params.id)) {
			const productId = req.params.id;
			await this.productService.deleteProduct(productId);

			return res
				.status(StatusCodes.OK)
				.json(new ApiResponse('Producto eliminado', StatusCodes.OK, null));
		}

		return res
			.status(StatusCodes.BAD_REQUEST)
			.json(
				new ApiResponse('Formato de Id incorrecto', StatusCodes.BAD_REQUEST, null)
			);
	}

	@Post(':id/purchase')
	async purchaseProduct(req: Request, res: Response): Promise<Response> {
		if (mongoose.Types.ObjectId.isValid(req.params.id)) {
			const productId = req.params.id;
			const quantity = req.body.quantity;
			const product = await this.productService.getProductById(productId);

			if (!product) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json(
						new ApiResponse(
							'Producto no encontrado',
							StatusCodes.NOT_FOUND,
							product
						)
					);
			}

			if (product.stock < quantity) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json(
						new ApiResponse(
							'No hay suficiente stock',
							StatusCodes.BAD_REQUEST,
							product
						)
					);
			}

			return res
				.status(StatusCodes.OK)
				.json(new ApiResponse('Hay suficiente stock', StatusCodes.OK, product));
		}

		return res
			.status(StatusCodes.BAD_REQUEST)
			.json(
				new ApiResponse('Formato de Id incorrecto', StatusCodes.BAD_REQUEST, null)
			);
	}
}
