import { getAllOrgService } from "@/services/Organizations";
import { useState } from "react";
import { useAuth } from "./useAuth";

export function useOrg() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false);
  const getAllOrg = async () => {
    setLoading(true)
    const response = getAllOrgService(token!)
    setLoading(false)
    return response
  }

  return {
    loading,
    getAllOrg
  }
}