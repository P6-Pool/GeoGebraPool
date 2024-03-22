// Original file: fastfiz-renderer-protobuffers/api.proto

import type { ShotType as _protobuf_ShotType, ShotType__Output as _protobuf_ShotType__Output } from '../protobuf/ShotType';
import type { Shot as _protobuf_Shot, Shot__Output as _protobuf_Shot__Output } from '../protobuf/Shot';
import type { Point as _protobuf_Point, Point__Output as _protobuf_Point__Output } from '../protobuf/Point';

export interface Shot {
  'type'?: (_protobuf_ShotType);
  'next'?: (_protobuf_Shot | null);
  'branch'?: (_protobuf_Shot | null);
  'posB1'?: (_protobuf_Point | null);
  'ghostBall'?: (_protobuf_Point | null);
  'leftMost'?: (_protobuf_Point | null);
  'rightMost'?: (_protobuf_Point | null);
  'b1'?: (number);
  'b2'?: (number);
  'id'?: (number);
}

export interface Shot__Output {
  'type': (_protobuf_ShotType__Output);
  'next': (_protobuf_Shot__Output | null);
  'branch': (_protobuf_Shot__Output | null);
  'posB1': (_protobuf_Point__Output | null);
  'ghostBall': (_protobuf_Point__Output | null);
  'leftMost': (_protobuf_Point__Output | null);
  'rightMost': (_protobuf_Point__Output | null);
  'b1': (number);
  'b2': (number);
  'id': (number);
}
