// components/generic/GenericDataTable.tsx
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type ColumnFiltersState, type SortingState, type VisibilityState } from '@tanstack/react-table'
import { PlusIcon } from 'lucide-react'

export interface GenericDataTableProps<T> {
  // Configuración de columnas
  createColumns: (onSuccess?: () => void) => ColumnDef<T>[]
  
  // Funciones de datos
  fetchData: (params?: any) => Promise<T[]>
  
  // Configuración de filtros
  searchColumn?: string
  searchPlaceholder?: string
  
  // Diálogo de crear
  CreateDialog?: React.ComponentType<{
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    onSuccess?: () => void
    [key: string]: any
  }>
  createDialogProps?: Record<string, any>
  
  // Parámetros adicionales para fetchData
  fetchParams?: any
  
  // Texto cuando no hay datos
  emptyMessage?: string
  createButtonText?: string
}

export function GenericDataTable<T>({
  createColumns,
  fetchData,
  searchColumn,
  searchPlaceholder = "Buscar...",
  CreateDialog,
  createDialogProps = {},
  fetchParams,
  emptyMessage = "Sin resultados.",
  createButtonText = "Crear nuevo"
}: GenericDataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<T[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Función para refrescar datos
  const refreshData = useCallback(() => {
    console.log('🔄 Refrescando datos...')
    setRefreshTrigger(prev => prev + 1)
  }, [])

  // Crear columnas con callback
  const columns = useMemo(() => createColumns(refreshData), [refreshData, createColumns])

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData(fetchParams)
        setData(result || [])
      } catch (error) {
        console.error('Error cargando datos:', error)
        setData([])
      }
    }
    
    loadData()
  }, [fetchParams, refreshTrigger, fetchData])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      {/* Barra de búsqueda */}
      {searchColumn && (
        <div className="flex items-center py-4">
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      
      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())
                    }
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className='flex flex-col justify-center items-center p-4 gap-2'>
                    <span>{emptyMessage}</span>
                    {CreateDialog && (
                      <Button onClick={() => setIsCreateOpen(true)} variant='outline'>
                        <PlusIcon /> {createButtonText}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de crear */}
      {CreateDialog && (
        <CreateDialog
          isOpen={isCreateOpen}
          setIsOpen={setIsCreateOpen}
          onSuccess={refreshData}
          {...createDialogProps}
        />
      )}
    </div>
  )
}