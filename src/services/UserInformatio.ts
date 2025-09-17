import type { User } from '@/types'
import type { createUserSchema, updateUserSchema } from '@/types/zod-schemas'
import { BaseCrudService } from '@/utils/base-crud-service'
import { httpClient } from '@/utils/http-client'
import type z from 'zod'

export type UpdateUserDto = z.infer<typeof updateUserSchema>
export type CreateUserDto = z.infer<typeof createUserSchema>

export class UserService extends BaseCrudService<User, CreateUserDto, UpdateUserDto> {
  constructor() {
    super({
      baseEndpoint: '/api/user'
      // Usa endpoints por defecto: /getAll, /create, /update/:id, etc.
    })
  }

  // 🎯 Métodos específicos si los necesitas
  async getUserByEmail(email: string): Promise<User> {
    return httpClient.get<User>(`${this.config.baseEndpoint}/by-email/${email}`)
  }
}

export const userService = new UserService()