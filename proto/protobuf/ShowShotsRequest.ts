// Original file: fastfiz-renderer-protobuffers/api.proto

import type { TableState as _protobuf_TableState, TableState__Output as _protobuf_TableState__Output } from '../protobuf/TableState';
import type { Shot as _protobuf_Shot, Shot__Output as _protobuf_Shot__Output } from '../protobuf/Shot';

export interface ShowShotsRequest {
  'tableState'?: (_protobuf_TableState | null);
  'shots'?: (_protobuf_Shot)[];
}

export interface ShowShotsRequest__Output {
  'tableState': (_protobuf_TableState__Output | null);
  'shots': (_protobuf_Shot__Output)[];
}
