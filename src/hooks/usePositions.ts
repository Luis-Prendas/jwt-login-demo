import { positionService, type CreatePositionDto, type UpdatePositionDto } from '@/services/Position.service'
import { useCrud } from './useCrud'
import type { Position } from '@/types'

export function usePositions() {
  return useCrud<Position, CreatePositionDto, UpdatePositionDto>(positionService)
}