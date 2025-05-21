// src/infrastructure/adapters/grpc-email-service-adapter.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { SendEmailRequest, SendEmailResponse } from '../../../../generated/email'; // Ajusta la ruta si es necesario
import { IEmailService } from '../../domain/services/email-service';
import * as path from 'path';

// Define el tipo de cliente gRPC que obtenemos de protoLoader
interface EmailGrpcClient {
	SendEmail(
		request: SendEmailRequest,
		callback: (error: grpc.ServiceError | null, response: SendEmailResponse) => void
	): grpc.ClientUnaryCall;
}

export class GrpcEmailService implements IEmailService {
	private client: EmailGrpcClient;
	private readonly serviceAddress: string;
	private readonly PROTO_FILE_NAME: string = 'email.proto'; // Solo el nombre del archivo
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

	private initializeGrpcClient(): EmailGrpcClient {
		const packageDefinition = protoLoader.loadSync(this.PROTO_FILE_PATH, {
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true,
		});

		const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
		const emailPackage = protoDescriptor.email as any; // Accede al paquete 'email'

		// Retorna la clase cliente gRPC tipada
		return new emailPackage.EmailService(
			this.serviceAddress,
			grpc.credentials.createInsecure() // Usar credenciales seguras en producción
		) as EmailGrpcClient; // Forzamos el tipo para asegurar compatibilidad
	}

	async sendPurchaseConfirmationEmail(
		to: string,
		subject: string,
		body: string
	): Promise<boolean> {
		const request: SendEmailRequest = { to, subject, body };

		return new Promise((resolve, reject) => {
			this.client.SendEmail(request, (error, response) => {
				if (error) {
					console.error('Error sending email via gRPC:', error);
					return reject(error);
				}
				if (!response || !response.success) {
					console.error(
						'Email sending failed according to service:',
						response?.message
					);
					return resolve(false); // La operación fue "exitosa" a nivel de gRPC, pero el servicio dijo que falló
				}
				console.log('Email sent successfully via gRPC:', response.message);
				resolve(true);
			});
		});
	}
}
