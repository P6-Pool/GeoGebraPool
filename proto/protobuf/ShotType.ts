// Original file: fastfiz-renderer-protobuffers/api.proto

export const ShotType = {
  CUE_STRIKE: 'CUE_STRIKE',
  POCKET: 'POCKET',
  RAIL: 'RAIL',
  STRIKE: 'STRIKE',
  KISS_LEFT: 'KISS_LEFT',
  KISS_RIGHT: 'KISS_RIGHT',
  BALL_BOTH: 'BALL_BOTH',
} as const;

export type ShotType =
  | 'CUE_STRIKE'
  | 0
  | 'POCKET'
  | 1
  | 'RAIL'
  | 2
  | 'STRIKE'
  | 3
  | 'KISS_LEFT'
  | 4
  | 'KISS_RIGHT'
  | 5
  | 'BALL_BOTH'
  | 6

export type ShotType__Output = typeof ShotType[keyof typeof ShotType]
