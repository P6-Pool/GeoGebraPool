import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { CueCanvasAPIClient as _protobuf_CueCanvasAPIClient, CueCanvasAPIDefinition as _protobuf_CueCanvasAPIDefinition } from './protobuf/CueCanvasAPI';

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
    CueCanvasAPI: SubtypeConstructor<typeof grpc.Client, _protobuf_CueCanvasAPIClient> & { service: _protobuf_CueCanvasAPIDefinition }
    Point: MessageTypeDefinition
    Shot: MessageTypeDefinition
    ShotType: EnumTypeDefinition
    ShowShotsRequest: MessageTypeDefinition
    TableState: MessageTypeDefinition
  }
}

