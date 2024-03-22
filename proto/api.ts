import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { JPoolAPIClient as _protobuf_JPoolAPIClient, JPoolAPIDefinition as _protobuf_JPoolAPIDefinition } from './protobuf/JPoolAPI';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Empty: MessageTypeDefinition
    }
  }
  protobuf: {
    Ball: MessageTypeDefinition
    JPoolAPI: SubtypeConstructor<typeof grpc.Client, _protobuf_JPoolAPIClient> & { service: _protobuf_JPoolAPIDefinition }
    Point: MessageTypeDefinition
    Shot: MessageTypeDefinition
    ShotType: EnumTypeDefinition
    ShowShotsRequest: MessageTypeDefinition
    TableState: MessageTypeDefinition
  }
}

