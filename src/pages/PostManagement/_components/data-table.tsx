import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnFiltersState, type SortingState, type VisibilityState, } from '@tanstack/react-table';
import { ChevronDown, PlusIcon } from 'lucide-react';
import { createColumns } from './columns';
import type { Position, Department } from '@/types';
import { usePositions } from '@/hooks/usePositions';
import { useDepartments } from '@/hooks/useDepartments';
import { DialogCreate } from './dialog-create';

export function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deptOptions, setDeptOptions] = useState<Department[] | null>(null)
  const [selectedDept, setSelectedDept] = useState('')
  const [positions, setPositions] = useState<Position[]>([])
  
  const { getAll: getAllPositions, loading: postsLoading, error: postsError } = usePositions()
  const { getAll: getAllDepartments, loading: deptsLoading, error: deptsError } = useDepartments()

  // Función para refrescar departamentos
  const refreshPositions = useCallback(async () => {
    if (!selectedDept || !deptOptions) return
    
    const selectedDeptData = deptOptions.find(dept => dept.name === selectedDept)
    
    if (selectedDeptData) {
      // Usar el hook unificado con callback
      await getAllPositions(
        { deptId: selectedDeptData.id }, // parámetros
        (data) => {
          setPositions(data || []) // callback de éxito
        }
      )
    }
  }, [selectedDept, deptOptions, getAllPositions])

  // Crear columnas con callback de refresh
  const columns = useMemo(() => createColumns(refreshPositions), [refreshPositions])

  // Cargar deptanizaciones con el hook unificado
  useEffect(() => {
    const loadDepartments = async () => {
      await getAllDepartments(
        undefined, // sin parámetros adicionales
        (depts) => {
          setDeptOptions(depts || [])
          setSelectedDept(depts?.[0]?.name || '')
        }
      )
    }
    
    loadDepartments()
  }, [getAllDepartments])

  // Cargar departamentos cuando cambie la dept2anización seleccionada
  useEffect(() => {
    if (selectedDept && deptOptions) {
      refreshPositions()
    }
  }, [selectedDept, deptOptions, refreshPositions])

  const table = useReactTable({
    data: positions,
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
  });

  // Loading state mejorado
  const isLoading = postsLoading || deptsLoading
  const hasError = postsError || deptsError

  return (
    <div className="w-full">
      {hasError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">
            Error: {postsError || deptsError}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Buscar departamentos..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          disabled={isLoading} // Deshabilitar durante carga
        />
        
        <div className='flex gap-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="ml-auto"
                disabled={isLoading || !deptOptions?.length} // Deshabilitar si está cargando
              >
                {deptsLoading ? 'Cargando...' : 'Deptanizaciones'} 
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Deptanizaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedDept} onValueChange={setSelectedDept}>
                {deptOptions?.map(option => (
                  <DropdownMenuRadioItem key={option.id} value={option.name}>
                    {option.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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
            {/* Loading state en la tabla */}
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>Cargando departamentos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
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
                    <span>Sin departamentos disponibles.</span>
                    <Button 
                      onClick={() => setIsCreateOpen(true)} 
                      variant='outline'
                      disabled={!selectedDept} // Solo habilitar si hay dept2 seleccionada
                    >
                      <PlusIcon /> Crear departamento
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pasar datos más específicos al diálogo */}
      <DialogCreate
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        deptId={deptOptions?.find(dept => dept.name === selectedDept)?.id || ''}
        onSuccess={refreshPositions} // Callback específico
      />
    </div>
  );
}