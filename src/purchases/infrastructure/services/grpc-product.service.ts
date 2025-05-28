import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import {
	GetProductRequest,
	ProductResponse,
	DecreaseStockRequest,
	DecreaseStockResponse,
} from '../../../../generated/product';
import { IProductService } from '../../domain/services/product-service';

import * as path from 'path';

// Define el tipo de cliente gRPC que obtenemos de protoLoader
interface ProductGrpcClient {
	GetProductById(
		request: GetProductRequest,
		callback: (error: grpc.ServiceError | null, response: ProductResponse) => void
	): grpc.ClientUnaryCall;
	DecreaseStock(
		request: DecreaseStockRequest,
		callback: (
			error: grpc.ServiceError | null,
			response: DecreaseStockResponse
		) => void
	): grpc.ClientUnaryCall;
}



export class GrpcProductService implements IProductService {
	private client: ProductGrpcClient;
	private readonly serviceAddress: string;
	private readonly PROTO_FILE_NAME: string = 'product.proto'; // Solo el nombre del archivo
	private readonly PROTO_FILE_PATH: string;

	constructor(serviceAddress: string) {
		this.PROTO_FILE_PATH = path.join(
			__dirname,
			'..',
			'..',
			'..',
			'..',
			'proto',
			this.PROTO_FILE_NAME
		);
		this.serviceAddress = serviceAddress;
		this.client = this.initializeGrpcClient();
	}

	private initializeGrpcClient(): ProductGrpcClient {
		const packageDefinition = protoLoader.loadSync(this.PROTO_FILE_PATH, {
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true,
		});

		const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
		const productPackage = protoDescriptor.product as any; // Accede al paquete 'email'

		// Retorna la clase cliente gRPC tipada
		return new productPackage.ProductService(
			this.serviceAddress,
			grpc.credentials.createInsecure() // Usar credenciales seguras en producción
		) as ProductGrpcClient; // Forzamos el tipo para asegurar compatibilidad
	}

	async getProductById(productId: string): Promise<any> {
		const request: GetProductRequest = { productId: productId };

		return new Promise<any>((resolve, reject) => {
			this.client.GetProductById(request, (error: any, response: any) => {
				if (error) return reject(error);

				resolve(response);
			});
		});
	}

	async decreaseStock(productId: string, quantity: number): Promise<boolean> {
		const request: DecreaseStockRequest = { productId, quantity };

		return new Promise<any>((resolve, reject) => {
			this.client.DecreaseStock(request, (error: any, response: any) => {
				if (error) return reject(error);

				resolve(response);
			});
		});
	}
}
