import { PurchaseService } from "../../application/services/purchase-service";
import { GrpcEmailService } from "../../infrastructure/services/grpc-email.service";
import { GrpcProductService } from "../../infrastructure/services/grpc-product.service";
import { PurchaseRepository } from "../../domain/repositories/purchase-repository";
import { Purchase } from "../../domain/entities/purchase";

jest.mock("axios");
import axios from "axios";

// Simula una respuesta válida de axios.get para el usuario
(axios.get as jest.Mock).mockResolvedValue({
  data: { data: { mail: "cliente@test.com" } }
});

describe("Integración: PurchaseService con gRPC", () => {
  const purchaseDto = {
    userId: "user-123",
    productId: "prod-123",
    quantity: 2
  };

  const mockProduct = {
    name: "Producto Test",
    description: "Descripción test",
    price: 1000,
    stock: 10,
    sellerId: "seller-001",
    sellerMail: "vendedor@test.com"
  };

  const mockPurchaseRepo: PurchaseRepository = {
    save: jest.fn(async (purchase: Purchase) => {
      (purchase as any)._id = "mocked-id";
      return purchase;
    }),
    getById: jest.fn()
  };

  const mockEmailService: GrpcEmailService = {
    sendPurchaseConfirmationEmail: jest.fn().mockResolvedValue(true)
  } as any;

  const mockProductService: GrpcProductService = {
    getProductById: jest.fn().mockResolvedValue(mockProduct),
    decreaseStock: jest.fn().mockResolvedValue(true)
  } as any;

  const service = new PurchaseService(
    mockPurchaseRepo,
    mockEmailService,
    mockProductService
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe realizar una compra completa (producto válido, stock suficiente, mails enviados)", async () => {
    const result = await service.createPurchase(purchaseDto);

    expect(mockProductService.getProductById).toHaveBeenCalledWith(purchaseDto.productId);
    expect(mockProductService.decreaseStock).toHaveBeenCalledWith(purchaseDto.productId, purchaseDto.quantity);

    expect(mockEmailService.sendPurchaseConfirmationEmail).toHaveBeenCalledWith(
      "cliente@test.com",
      expect.stringContaining("Compra"),
      expect.stringContaining("Gracias")
    );

    expect(mockEmailService.sendPurchaseConfirmationEmail).toHaveBeenCalledWith(
      "vendedor@test.com",
      expect.stringContaining("Venta"),
      expect.stringContaining("Se efectuó")
    );

    expect(result).toMatchObject({
      existProduct: true,
      hasStock: true,
      purchase: expect.objectContaining({
        productId: purchaseDto.productId,
        userId: purchaseDto.userId,
        quantity: purchaseDto.quantity,
        name: mockProduct.name
      })
    });
  });

  it("debe fallar si el producto no existe", async () => {
    (mockProductService.getProductById as jest.Mock).mockRejectedValue(new Error("Producto no encontrado"));

    await expect(service.createPurchase(purchaseDto)).rejects.toThrow("Producto no encontrado");

    expect(mockProductService.getProductById).toHaveBeenCalledWith(purchaseDto.productId);
  });

  it("debe retornar hasStock = false si no hay suficiente stock", async () => {
    (mockProductService.getProductById as jest.Mock).mockResolvedValue({ ...mockProduct, stock: 0 });

    const result = await service.createPurchase(purchaseDto);

    expect(result).toMatchObject({
      existProduct: true,
      hasStock: false,
      purchase: null
    });

    expect(mockProductService.decreaseStock).not.toHaveBeenCalled();
  });


});
