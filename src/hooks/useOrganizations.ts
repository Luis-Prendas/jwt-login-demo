import type { Organization } from '@/types'
import { useCrud } from './useCrud'
import { organizationService, type CreateOrganizationDto, type UpdateOrganizationDto } from '@/services/Organizations'

export function useOrganizations() {
  return useCrud<Organization, CreateOrganizationDto, UpdateOrganizationDto>(organizationService)
}