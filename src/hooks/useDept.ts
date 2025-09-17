import { useState } from "react";
import { useAuth } from "./useAuth";
import { createDeptService, deleteDeptService, getAllDeptService, getDeptService, updateDeptService, type CreateDepartmentDto, type UpdateDepartmentDto } from "@/services/Department";

export function useDept() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false);

  const getAllDept = async ({ orgId }: { orgId: string }) => {
    setLoading(true)
    const response = getAllDeptService(orgId, token!)
    setLoading(false)
    return response
  }

  const getDept = async ({ id }: { id: string }) => {
    setLoading(true)
    const response = getDeptService(id, token!)
    setLoading(false)
    return response
  }

  const updateDept = async ({ dataUpdate, id }: { dataUpdate: UpdateDepartmentDto, id: string }) => {
    setLoading(true)
    const response = updateDeptService(dataUpdate, id, token!)
    setLoading(false)
    return response
  }

  const createDept = async ({ createData, orgId }: { createData: CreateDepartmentDto, orgId: string }) => {
    setLoading(true)
    const response = createDeptService(createData, orgId, token!)
    setLoading(false)
    return response
  }

  const deleteDept = async (id: string) => {
    setLoading(true)
    const response = deleteDeptService(id, token!)
    setLoading(false)
    return response
  }

  return {
    loading,
    getAllDept,
    getDept,
    updateDept,
    createDept,
    deleteDept
  }
}