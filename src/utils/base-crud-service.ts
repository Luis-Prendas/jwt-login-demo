import { httpClient } from './http-client'

export interface CrudServiceConfig {
  baseEndpoint: string  // ej: '/api/user', '/api/department'
  paramEndpoints?: {
    getAll?: string      // ej: '/getAll/:orgId' 
    create?: string      // ej: '/create/:orgId'
    update?: string      // ej: '/update/:id'
    delete?: string      // ej: '/delete/:id'
    getOne?: string      // ej: '/get/:id'
  }
}

export abstract class BaseCrudService<TEntity, TCreateDto, TUpdateDto> {
  protected config: CrudServiceConfig

  constructor(config: CrudServiceConfig) {
    this.config = {
      paramEndpoints: {
        getAll: '/getAll',
        create: '/create',
        update: '/update/:id',
        delete: '/delete/:id',
        getOne: '/get/:id',
      },
      ...config
    }
  }

  // Helper para reemplazar parámetros en URLs
  private buildUrl(endpoint: string, params: Record<string, string> = {}): string {
    let url = `${this.config.baseEndpoint}${endpoint}`
    
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value)
    })
    
    return url
  }

  // CRUD Methods
  async getAll(params: Record<string, string> = {}): Promise<TEntity[]> {
    const url = this.buildUrl(this.config.paramEndpoints!.getAll!, params)
    return httpClient.get<TEntity[]>(url)
  }

  async getOne(id: string, params: Record<string, string> = {}): Promise<TEntity> {
    const url = this.buildUrl(this.config.paramEndpoints!.getOne!, { id, ...params })
    return httpClient.get<TEntity>(url)
  }

  async create(data: TCreateDto, params: Record<string, string> = {}): Promise<TEntity> {
    const url = this.buildUrl(this.config.paramEndpoints!.create!, params)
    return httpClient.post<TEntity>(url, data)
  }

  async update(id: string, data: TUpdateDto, params: Record<string, string> = {}): Promise<TEntity> {
    const url = this.buildUrl(this.config.paramEndpoints!.update!, { id, ...params })
    return httpClient.put<TEntity>(url, data)
  }

  async delete(id: string, params: Record<string, string> = {}): Promise<boolean> {
    const url = this.buildUrl(this.config.paramEndpoints!.delete!, { id, ...params })
    await httpClient.delete(url)
    return true
  }
}