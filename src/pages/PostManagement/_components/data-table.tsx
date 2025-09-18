import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnFiltersState, type SortingState, type VisibilityState, } from '@tanstack/react-table';
import { ChevronDown, PlusIcon } from 'lucide-react';
import { createColumns } from './columns';
import type { Position, Department, Organization } from '@/types';
import { usePositions } from '@/hooks/usePositions';
import { useDepartments } from '@/hooks/useDepartments';
import { useOrganizations } from '@/hooks/useOrganizations';
import { DialogCreate } from './dialog-create';
import { Link } from 'react-router';

export function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [orgOptions, setOrgOptions] = useState<Organization[] | null>(null)
  const [deptOptions, setDeptOptions] = useState<Department[] | null>(null)
  const [selectedOrg, setSelectedOrg] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [positions, setPositions] = useState<Position[]>([])
  const [needDept, setNeedDept] = useState<Boolean>(false)

  const { getAll: getAllPositions, loading: postsLoading, error: postsError } = usePositions()
  const { getAll: getAllDepartments, loading: deptsLoading, error: deptsError } = useDepartments()
  const { getAll: getAllOrganizations, loading: orgsLoading, error: orgsError } = useOrganizations()

  // Función para refrescar posiciones
  const refreshPositions = useCallback(async () => {
    if (!selectedDept || !deptOptions) return

    const selectedDeptData = deptOptions.find(dept => dept.name === selectedDept)

    if (selectedDeptData) {
      const response = await getAllPositions(
        { deptId: selectedDeptData.id },
        (data) => {
          setPositions(data || [])
        }
      )

      if (!response) {
        setPositions([])
        setNeedDept(false)
      }
    }
  }, [selectedDept, deptOptions, getAllPositions])

  // Función para cargar departamentos cuando cambie la organización
  const loadDepartments = useCallback(async (orgId: string) => {
    const response = await getAllDepartments(
      { orgId },
      (data) => {
        setDeptOptions(data || [])
        setSelectedDept(data?.[0]?.name || '')
        setPositions([]) // Limpiar posiciones al cambiar organización
      }
    )

    if (!response) {
      setDeptOptions(null)
      setPositions([])
      setNeedDept(true)
    }
  }, [getAllDepartments])

  // Crear columnas con callback de refresh
  const columns = useMemo(() => createColumns(refreshPositions), [refreshPositions])

  // Cargar organizaciones al inicio
  useEffect(() => {
    const loadOrganizations = async () => {
      await getAllOrganizations(
        undefined,
        (orgs) => {
          setOrgOptions(orgs || [])
          setSelectedOrg(orgs?.[0]?.displayName || '')
        }
      )
    }

    loadOrganizations()
  }, [getAllOrganizations])

  // Cargar departamentos cuando cambie la organización seleccionada
  useEffect(() => {
    if (selectedOrg && orgOptions) {
      const selectedOrgData = orgOptions.find(org => org.displayName === selectedOrg)
      if (selectedOrgData) {
        loadDepartments(selectedOrgData.id)
      }
    }
  }, [selectedOrg, orgOptions, loadDepartments])

  // Cargar posiciones cuando cambie el departamento seleccionado
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
  const isLoading = postsLoading || deptsLoading || orgsLoading
  const hasError = postsError || deptsError || orgsError

  return (
    <div className="w-full">
      {hasError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">
            Error: {postsError || deptsError || orgsError}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Buscar posiciones..."
          value={(table.getColumn("Nombre del puesto masculino")?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn("Nombre del puesto masculino")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          disabled={isLoading}
        />

        <div className='flex gap-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto"
                disabled={isLoading || !orgOptions?.length}
              >
                {orgsLoading ? 'Cargando...' : 'Organizaciones'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Organizaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedOrg} onValueChange={setSelectedOrg}>
                {orgOptions?.map(option => (
                  <DropdownMenuRadioItem key={option.id} value={option.displayName}>
                    {option.displayName}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto"
                disabled={isLoading || !deptOptions?.length}
              >
                {deptsLoading ? 'Cargando...' : 'Departamentos'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Departamentos</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {deptOptions ? (
                <DropdownMenuRadioGroup value={selectedDept} onValueChange={setSelectedDept}>
                  {deptOptions?.map(option => (
                    <DropdownMenuRadioItem key={option.id} value={option.name}>
                      {option.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              ) : (
                <DropdownMenuLabel>Departamentos</DropdownMenuLabel>
              )}
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>Cargando posiciones...</span>
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
            ) : deptOptions === null || needDept === true ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className='flex flex-col justify-center items-center p-4 gap-2'>
                    <span>Sin departamentos disponibles.</span>
                    <Link to='/department-management'>
                      <Button variant='outline'>
                        <PlusIcon /> Crear departamento
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className='flex flex-col justify-center items-center p-4 gap-2'>
                    <span>Sin posiciones disponibles.</span>
                    <Button
                      onClick={() => setIsCreateOpen(true)}
                      variant='outline'
                      disabled={!selectedDept}
                    >
                      <PlusIcon /> Crear posición
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DialogCreate
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        deptId={deptOptions?.find(dept => dept.name === selectedDept)?.id || ''}
        onSuccess={refreshPositions}
      />
    </div>
  );
}