import { GenericContainer } from "testcontainers";
import { PurchaseService } from "../../application/services/purchase-service";
import { GrpcEmailService } from "../../infrastructure/services/grpc-email.service";
import { GrpcProductService } from "../../infrastructure/services/grpc-product.service";
import { PurchaseRepository } from "../../domain/repositories/purchase-repository";
import { Purchase } from "../../domain/entities/purchase";
import axios from "axios";

jest.setTimeout(30000); // Aumentamos el timeout porque levantar contenedores lleva tiempo

describe("Integración REAL: PurchaseService usando servicios gRPC reales", () => {
  let sellerContainer: any;
  let mailContainer: any;

  let service: PurchaseService;

  const purchaseDto = {
    userId: "user-123",
    productId: "prod-123",
    quantity: 2
  };

  const mockPurchaseRepo: PurchaseRepository = {
    save: jest.fn(async (purchase: Purchase) => {
      (purchase as any)._id = "mocked-id";
      return purchase;
    }),
    getById: jest.fn()
  };

  beforeAll(async () => {
    sellerContainer = await new GenericContainer("seller-image")
      .withExposedPorts(50051)
      .start();

    mailContainer = await new GenericContainer("mail-image")
      .withExposedPorts(50052)
      .start();

    const sellerHost = sellerContainer.getHost();
    const sellerPort = sellerContainer.getMappedPort(50051);

    const mailHost = mailContainer.getHost();
    const mailPort = mailContainer.getMappedPort(50052);

    const productService = new GrpcProductService(`${sellerHost}:${sellerPort}`);
    const emailService = new GrpcEmailService(`${mailHost}:${mailPort}`);

    service = new PurchaseService(mockPurchaseRepo, emailService, productService);

    await new Promise(res => setTimeout(res, 2000));
  });

  afterAll(async () => {
    await sellerContainer.stop();
    await mailContainer.stop();
  });

  it("debe realizar una compra completa (producto válido, stock suficiente, mails enviados)", async () => {
    const result = await service.createPurchase(purchaseDto);

    expect(result.purchase).toMatchObject({
      productId: purchaseDto.productId,
      userId: purchaseDto.userId,
      quantity: purchaseDto.quantity,
      name: expect.any(String)
    });
  });

  it("debe fallar si el producto no existe", async () => {
    const invalidDto = { ...purchaseDto, productId: "producto-inexistente" };

    await expect(service.createPurchase(invalidDto)).rejects.toThrow("Producto no encontrado");
  });

  it("debe fallar si no hay stock suficiente", async () => {
    const dtoSinStock = { ...purchaseDto, quantity: 9999 };

    await expect(service.createPurchase(dtoSinStock)).rejects.toThrow("Stock insuficiente");
  });



  it("debe reducir el stock del producto", async () => {
    const mockUpdateStock = jest.fn();
    const productService = {
      getProductById: jest.fn(() => ({
        productId: "prod-123",
        name: "Producto Test",
        price: 100,
        stock: 10,
      })),
      reduceProductStock: mockUpdateStock
    };

    const serviceStock = new PurchaseService(mockPurchaseRepo, {} as any, productService as any);

    await serviceStock.createPurchase(purchaseDto);

    expect(mockUpdateStock).toHaveBeenCalledWith("prod-123", 2);
  });
});
