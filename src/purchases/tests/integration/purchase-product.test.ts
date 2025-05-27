// tests/integration/purchase-service.integration.test.ts
import { PurchaseService } from "../../application/services/purchase-service";
import { PurchaseRepository } from "../../domain/repositories/purchase-repository";
import { productClient } from "../../infrastructure/services/product-grpc-client";
import { GrpcEmailService } from "../../infrastructure/services/grpc-email.service";
import { Purchase } from "../../domain/entities/purchase";

// Mock manual para los servicios gRPC
jest.mock("../../infrastructure/services/product-grpc-client", () => ({
  productClient: {
    GetProductById: jest.fn(),
    DecreaseStock: jest.fn(),
  },
}));

jest.mock("../../infrastructure/services/grpc-email.service");

jest.mock("axios");
import axios from "axios";

(axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

describe("Integración: PurchaseService", () => {
  const mockPurchaseRepo: PurchaseRepository = {
    save: jest.fn(async (purchase: Purchase) => {
      // Simula persistencia retornando el mismo objeto con _id simulado
      (purchase as any)._id = "mocked-id";
      return purchase;
    }),
    getById: jest.fn()
  };

  const mockEmailService = new GrpcEmailService("localhost:50053") as jest.Mocked<GrpcEmailService>;

  const service = new PurchaseService(mockPurchaseRepo, mockEmailService);

  const purchaseDto = {
    userId: "user-123",
    productId: "prod-123",
    quantity: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe realizar una compra y enviar email de confirmación", async () => {
    // Mocks para gRPC
    (productClient.GetProductById as jest.Mock).mockImplementation((data, callback) => {
      callback(null, {
        name: "Producto Test",
        description: "Descripción test",
        price: 1000,
        sellerId: "seller-001"
      });
    });

    (productClient.DecreaseStock as jest.Mock).mockImplementation((data, callback) => {
      callback(null, { success: true });
    });

    (mockEmailService.sendPurchaseConfirmationEmail as jest.Mock).mockResolvedValue(true);

    const result = await service.createPurchase(purchaseDto);

    // Validaciones
    expect(productClient.GetProductById).toHaveBeenCalledWith(
      { productId: "prod-123" },
      expect.any(Function)
    );

    expect(productClient.DecreaseStock).toHaveBeenCalledWith(
      { productId: "prod-123", quantity: 1 },
      expect.any(Function)
    );

    expect(mockEmailService.sendPurchaseConfirmationEmail).toHaveBeenCalledWith(
      expect.stringMatching(/@/),
      expect.any(String),
      expect.stringContaining("Gracias por tu compra")
    );

    expect(result).toEqual(expect.objectContaining({
      productId: "prod-123",
      userId: "user-123",
      quantity: 1,
      name: "Producto Test"
    }));
  });

  it("debe fallar si el producto no existe", async () => {
    (productClient.GetProductById as jest.Mock).mockImplementation((data, callback) => {
      callback(new Error("Producto no encontrado"), null);
    });

    await expect(service.createPurchase(purchaseDto)).rejects.toThrow("Producto no encontrado");

    expect(productClient.GetProductById).toHaveBeenCalledWith(
      { productId: purchaseDto.productId },
      expect.any(Function)
    );
  });

  it("debe fallar si no se puede disminuir el stock", async () => {
    // Producto existe
    (productClient.GetProductById as jest.Mock).mockImplementation((data, callback) => {
      callback(null, {
        name: "Producto Test",
        description: "Desc",
        price: 500,
        sellerId: "seller-id"
      });
    });

    // Falla al disminuir stock
    (productClient.DecreaseStock as jest.Mock).mockImplementation((data, callback) => {
      callback(new Error("Stock insuficiente"), null);
    });

    await expect(service.createPurchase(purchaseDto)).rejects.toThrow("Stock insuficiente");

    expect(productClient.DecreaseStock).toHaveBeenCalledWith(
      { productId: purchaseDto.productId, quantity: purchaseDto.quantity },
      expect.any(Function)
    );
  });

});
