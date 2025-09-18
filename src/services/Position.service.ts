import type { Position } from '@/types'
import type { createPositionSchema, updatePositionSchema } from '@/types/zod-schemas'
import { BaseCrudService } from '@/utils/base-crud-service'
import { httpClient } from '@/utils/http-client'
import type z from 'zod'

export type UpdatePositionDto = z.infer<typeof updatePositionSchema>
export type CreatePositionDto = z.infer<typeof createPositionSchema>

export class PositionService extends BaseCrudService<Position, CreatePositionDto, UpdatePositionDto> {
  constructor() {
    super({
      baseEndpoint: '/api/position',
      paramEndpoints: {
        getAll: '/getAll/:deptId',    // 👈 Override: necesita deptId
        create: '/create/:deptId',    // 👈 Override: necesita deptId
        update: '/update/:id',       // 👈 Default está bien
        delete: '/delete/:id',       // 👈 Default está bien
        getOne: '/get/:id',          // 👈 Default está bien
      }
    })
  }

  // 🎯 Métodos específicos
  async getPositionByUserId(userId: string): Promise<Position[]> {
    return httpClient.get<Position[]>(`${this.config.baseEndpoint}/by-user/${userId}`)
  }
}

export const positionService = new PositionService()