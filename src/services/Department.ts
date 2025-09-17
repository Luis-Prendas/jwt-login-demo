import type { Department } from '@/types'
import type { createDepartmentSchema, updateDepartmentSchema } from '@/types/zod-schemas'
import { BaseCrudService } from '@/utils/base-crud-service'
import { httpClient } from '@/utils/http-client'
import type z from 'zod'

export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>
export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>

export class DepartmentService extends BaseCrudService<Department, CreateDepartmentDto, UpdateDepartmentDto> {
  constructor() {
    super({
      baseEndpoint: '/api/department',
      paramEndpoints: {
        getAll: '/getAll/:orgId',    // 👈 Override: necesita orgId
        create: '/create/:orgId',    // 👈 Override: necesita orgId
        update: '/update/:id',       // 👈 Default está bien
        delete: '/delete/:id',       // 👈 Default está bien
        getOne: '/get/:id',          // 👈 Default está bien
      }
    })
  }

  // 🎯 Métodos específicos
  async getDepartmentsByUserId(userId: string): Promise<Department[]> {
    return httpClient.get<Department[]>(`${this.config.baseEndpoint}/by-user/${userId}`)
  }
}

export const departmentService = new DepartmentService()