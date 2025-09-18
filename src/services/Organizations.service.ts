import type { Organization } from '@/types'
import type { createOrganizationSchema, updateOrganizationSchema } from '@/types/zod-schemas'
import { BaseCrudService } from '@/utils/base-crud-service'
import type z from 'zod'

export type UpdateOrganizationDto = z.infer<typeof updateOrganizationSchema>
export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>

export class OrganizationService extends BaseCrudService<Organization, CreateOrganizationDto, UpdateOrganizationDto> {
  constructor() {
    super({
      baseEndpoint: '/api/organization'
      // Usa endpoints por defecto
    })
  }
}

export const organizationService = new OrganizationService()