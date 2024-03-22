// Original file: fastfiz-renderer-protobuffers/api.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../google/protobuf/Empty';
import type { ShowShotsRequest as _protobuf_ShowShotsRequest, ShowShotsRequest__Output as _protobuf_ShowShotsRequest__Output } from '../protobuf/ShowShotsRequest';

export interface JPoolAPIClient extends grpc.Client {
  ShowShots(argument: _protobuf_ShowShotsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  ShowShots(argument: _protobuf_ShowShotsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  ShowShots(argument: _protobuf_ShowShotsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  ShowShots(argument: _protobuf_ShowShotsRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  showShots(argument: _protobuf_ShowShotsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  showShots(argument: _protobuf_ShowShotsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  showShots(argument: _protobuf_ShowShotsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  showShots(argument: _protobuf_ShowShotsRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
}

export interface JPoolAPIHandlers extends grpc.UntypedServiceImplementation {
  ShowShots: grpc.handleUnaryCall<_protobuf_ShowShotsRequest__Output, _google_protobuf_Empty>;
  
}

export interface JPoolAPIDefinition extends grpc.ServiceDefinition {
  ShowShots: MethodDefinition<_protobuf_ShowShotsRequest, _google_protobuf_Empty, _protobuf_ShowShotsRequest__Output, _google_protobuf_Empty__Output>
}
