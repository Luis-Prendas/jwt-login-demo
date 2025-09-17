import type { Organization } from "@/types";
import type { createOrganizationSchema, updateOrganizationSchema } from "@/types/zod-schemas";
import type z from "zod";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';

export type UpdateOrganizationDto = z.infer<typeof updateOrganizationSchema>
export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>

export async function getOrgService(orgId: string, token: string): Promise<Organization | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/organization/get/${orgId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error(`❌ Error en getOrgService: ${error}`);
    return null;
  }
}

export async function getAllOrgService(token: string): Promise<Organization[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/organization/getAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all org info');
    }

    const data = await response.json();
    return data.data
  } catch (error) {
    console.error(`❌ Error en getAllOrgService: ${error}`);
    return null;
  }
}

export async function updateOrgService(dataUpdate: UpdateOrganizationDto, orgId: string, token: string): Promise<boolean | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/organization/update/${orgId}`, {
      method: 'PUT',
      body: JSON.stringify(dataUpdate),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return true;
  } catch (error) {
    console.error(`❌ Error en updateOrgService: ${error}`);
    return null;
  }
}

export async function createOrgService(createData: CreateOrganizationDto, token: string): Promise<boolean | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/organization/create`, {
      method: 'POST',
      body: JSON.stringify(createData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return true;
  } catch (error) {
    console.error(`❌ Error en getAllOrgService: ${error}`);
    return null;
  }
}

export async function deleteOrgService(orgId: string, token: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/organization/delete/${orgId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return true;
  } catch (error) {
    console.error(`❌ Error en deleteOrgService: ${error}`);
    return null;
  }
}