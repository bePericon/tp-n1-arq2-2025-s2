// src/infrastructure/grpc/clients/seller-grpc-client.ts

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../protos/seller.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

export const sellerClient = new proto.seller.SellerService(
  'localhost:50051', // o la IP/hostname si está en otro servidor
  grpc.credentials.createInsecure()
);
