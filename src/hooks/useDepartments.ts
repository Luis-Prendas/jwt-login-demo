import { departmentService, type CreateDepartmentDto, type UpdateDepartmentDto } from '@/services/Department'
import { useCrud } from './useCrud'
import type { Department } from '@/types'

export function useDepartments() {
  return useCrud<Department, CreateDepartmentDto, UpdateDepartmentDto>(departmentService)
}