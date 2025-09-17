import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnFiltersState, type SortingState, type VisibilityState, } from '@tanstack/react-table';
import { ChevronDown, PlusIcon } from 'lucide-react';
import { createColumns } from './columns';
import type { Organization } from '@/types';
import { DialogCreateOrganization } from './dialog-create-organization';
import { useOrganizations } from '@/hooks/useOrganizations';

export function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [organizations, setOrganizations] = useState<Organization[]>([])

  const { getAll: getAllOrganizations, loading: orgsLoading, error: orgsError } = useOrganizations()

  // Función para refrescar departamentos
  const refreshDepartments = useCallback(async () => {
    await getAllOrganizations(
      undefined,
      (orgs) => {
        setOrganizations(orgs || [])
      }
    )
  }, [])

  // Crear columnas con callback de refresh
  const columns = useMemo(() => createColumns(refreshDepartments), [refreshDepartments])

  // Cargar organizaciones con el hook unificado
  useEffect(() => {
    const loadOrganizations = async () => {
      await getAllOrganizations(
        undefined,
        (orgs) => {
          setOrganizations(orgs || [])
        }
      )
    }

    loadOrganizations()
  }, [getAllOrganizations])

  // Cargar departamentos cuando cambie la organización seleccionada
  useEffect(() => {
    refreshDepartments()
  }, [refreshDepartments])

  const table = useReactTable({
    data: organizations,
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
  const isLoading = orgsLoading
  const hasError = orgsError

  return (
    <div className="w-full">
      {hasError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">
            Error: {orgsError}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Buscar departamentos..."
          value={(table.getColumn("Nombre corporativo")?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn("Nombre corporativo")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          disabled={isLoading} // Deshabilitar durante carga
        />

        <div className='flex gap-4'>
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
      <DialogCreateOrganization
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        onSuccess={refreshDepartments} // Callback específico
      />
    </div>
  );
}