import { createOrgService, deleteOrgService, getAllOrgService, getOrgService, updateOrgService, type CreateOrganizationDto, type UpdateOrganizationDto } from "@/services/Organizations";
import { useState } from "react";
import { useAuth } from "./useAuth";

export function useOrg() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false);

  const getOrg = async (orgId: string) => {
    setLoading(true)
    const response = getOrgService(orgId, token!)
    setLoading(false)
    return response
  }

  const getAllOrg = async () => {
    setLoading(true)
    const response = getAllOrgService(token!)
    setLoading(false)
    return response
  }

  const updateOrg = async (dataUpdate: UpdateOrganizationDto, orgId: string, ) => {
    setLoading(true)
    const response = updateOrgService(dataUpdate, orgId, token!)
    setLoading(false)
    return response
  }

  const createOrg = async (createData: CreateOrganizationDto) => {
    setLoading(true)
    const response = createOrgService(createData, token!)
    setLoading(false)
    return response
  }

  const deleteOrg = async (orgId: string) => {
    setLoading(true)
    const response = deleteOrgService(orgId, token!)
    setLoading(false)
    return response
  }

  return {
    loading,
    getAllOrg,
    getOrg,
    updateOrg,
    createOrg,
    deleteOrg
  }
}