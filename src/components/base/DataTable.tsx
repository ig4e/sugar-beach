import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Button,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { CheckIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { LoadingOverlay, Pagination } from "@mantine/core";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageInfo: { totalPages: number; nextCursor?: number; prevCursor?: number };
  onPaginationChange?: (cursor: number) => void;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageInfo,
  onPaginationChange,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [paginationState, setPaginationState] = useState<{ cursor: number }>({
    cursor: 1,
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  });

  useEffect(() => {
    onPaginationChange && onPaginationChange(paginationState.cursor);
  }, [paginationState.cursor]);

  return (
    <div className="rounded-xl bg-gray-50">
      <div className="relative">
        <LoadingOverlay
          visible={isLoading ?? false}
          overlayBlur={2}
        ></LoadingOverlay>
        <div className="overflow-auto rounded-xl">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-start">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mx-2 flex justify-end border-b py-2">
        <Menu isLazy placement="bottom-end">
          <MenuButton
            as={Button}
            colorScheme="gray"
            rightIcon={<ChevronDownIcon className="h-4 w-4" />}
            size={"sm"}
          >
            Columns
          </MenuButton>
          <MenuList>
            <Heading
              size="xs"
              px={3}
              py={1}
              display={"flex"}
              alignItems={"center"}
            >
              Columns
            </Heading>
            <MenuDivider></MenuDivider>

            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <MenuItem
                    key={column.id}
                    className="capitalize"
                    value={column.id}
                    icon={
                      column.getIsVisible() ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        <EyeSlashIcon className="h-4 w-4" />
                      )
                    }
                    onClick={() =>
                      column.toggleVisibility(!column.getIsVisible())
                    }
                  >
                    {column.columnDef.header?.toString() || column.id}
                  </MenuItem>
                );
              })}
          </MenuList>
        </Menu>
      </div>
      <div className="p-2">
        <HStack justifyContent={"center"}>
          <Pagination
            value={paginationState.cursor}
            total={
              (pageInfo && pageInfo?.totalPages > 0
                ? pageInfo?.totalPages
                : 1) ?? 1
            }
            onChange={(page) =>
              setPaginationState((state) => ({ ...state, cursor: page }))
            }
          />
        </HStack>
      </div>
    </div>
  );
}

export default DataTable;
