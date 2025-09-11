import { getAllOrgService, getOrgService, updateOrgService } from "@/services/Organizations";
import { useState } from "react";
import { useAuth } from "./useAuth";

export interface UpdateOrg {
  corporateName: string
  displayName: string
  slogan: string
}

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

  const updateOrg = async (dataUpdate: UpdateOrg, orgId: string) => {
    setLoading(true)
    const response = updateOrgService(dataUpdate, orgId, token!)
    setLoading(false)
    return response
  }

  return {
    loading,
    getAllOrg,
    getOrg,
    updateOrg
  }
}