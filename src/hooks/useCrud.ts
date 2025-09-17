import type { BaseCrudService } from '@/utils/base-crud-service'
import { useState, useCallback } from 'react'

export function useCrud<TEntity, TCreateDto, TUpdateDto>(
  service: BaseCrudService<TEntity, TCreateDto, TUpdateDto>
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void
  ): Promise<T | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await operation()
      onSuccess?.(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('❌ CRUD Error:', errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getAll = useCallback((params?: Record<string, string>, onSuccess?: (data: TEntity[]) => void) => {
    return handleAsync(() => service.getAll(params), onSuccess)
  }, [service, handleAsync])

  const getOne = useCallback((id: string, params?: Record<string, string>, onSuccess?: (data: TEntity) => void) => {
    return handleAsync(() => service.getOne(id, params), onSuccess)
  }, [service, handleAsync])

  const create = useCallback((data: TCreateDto, params?: Record<string, string>, onSuccess?: () => void) => {
    return handleAsync(
      () => service.create(data, params),
      () => onSuccess?.()
    )
  }, [service, handleAsync])

  const update = useCallback((id: string, data: TUpdateDto, params?: Record<string, string>, onSuccess?: () => void) => {
    return handleAsync(
      () => service.update(id, data, params),
      () => onSuccess?.()
    )
  }, [service, handleAsync])

  const remove = useCallback((id: string, params?: Record<string, string>, onSuccess?: () => void) => {
    return handleAsync(
      () => service.delete(id, params),
      () => onSuccess?.()
    )
  }, [service, handleAsync])

  return {
    loading,
    error,
    getAll,
    getOne,
    create,
    update,
    remove,
    clearError: () => setError(null)
  }
}