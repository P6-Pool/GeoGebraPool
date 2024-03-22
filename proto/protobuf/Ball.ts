// Original file: fastfiz-renderer-protobuffers/api.proto

import type { Point as _protobuf_Point, Point__Output as _protobuf_Point__Output } from '../protobuf/Point';

export interface Ball {
  'pos'?: (_protobuf_Point | null);
  'number'?: (number);
  'state'?: (number);
}

export interface Ball__Output {
  'pos': (_protobuf_Point__Output | null);
  'number': (number);
  'state': (number);
}
