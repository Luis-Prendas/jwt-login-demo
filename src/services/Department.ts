import type { Department } from "@/types";
import type { createDepartmentSchema, updateDepartmentSchema } from "@/types/zod-schemas";
import type z from "zod";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';

export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>
export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>

export async function getAllDeptService(orgId: string, token: string): Promise<Department[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/department/getAll/${orgId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all dept info');
    }

    const data = await response.json();
    return data.data
  } catch (error) {
    console.error(`❌ Error en getAllDeptService: ${error}`);
    return null;
  }
}

export async function getDeptService(id: string, token: string): Promise<Department | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/department/get/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dept info');
    }

    const data = await response.json();
    return data.data
  } catch (error) {
    console.error(`❌ Error en getDeptService: ${error}`);
    return null;
  }
}

export async function updateDeptService(dataUpdate: UpdateDepartmentDto, id: string, token: string): Promise<Department | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/department/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dataUpdate),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to update dept info');
    }

    const data = await response.json();
    return data.data
  } catch (error) {
    console.error(`❌ Error en updateDeptService: ${error}`);
    return null;
  }
}

export async function createDeptService(createData: CreateDepartmentDto, orgId: string, token: string): Promise<boolean | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/department/create/${orgId}`, {
      method: 'POST',
      body: JSON.stringify(createData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to create dept info');
    }

    return true;
  } catch (error) {
    console.error(`❌ Error en createOrgService: ${error}`);
    return null;
  }
}

export async function deleteDeptService(id: string, token: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/department/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete user info');
    }

    return true;
  } catch (error) {
    console.error(`❌ Error en deleteDeptService: ${error}`);
    return null;
  }
}