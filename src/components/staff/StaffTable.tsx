import React, { useMemo } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton,
  Heading,
  Badge,
  HStack,
  Avatar,
  Text,
  Button,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@prisma/client";
import { api } from "~/utils/api";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import {
  AdjustmentsHorizontalIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";
import { LogoLargeDynamicPath } from "../logos";
import Input from "../base/Input";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;
      const userImage = user.media?.url ?? user.image ?? LogoLargeDynamicPath;

      return (
        <HStack>
          <Avatar src={userImage} name={user.name} size="sm"></Avatar>
          <Text>{row.renderValue("name")}</Text>
        </HStack>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return <Badge>{row.renderValue("role")}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Menu isLazy placement="bottom-end">
          <MenuButton w={"full"}>
            <IconButton
              size="sm"
              aria-label="actions"
              colorScheme="gray"
              icon={
                <EllipsisHorizontalIcon className="h-5 w-5"></EllipsisHorizontalIcon>
              }
              me={"auto"}
            ></IconButton>
          </MenuButton>
          <MenuList>
            <Heading
              size="xs"
              px={3}
              py={1}
              display={"flex"}
              alignItems={"center"}
            >
              <span className="inline-block max-w-[5rem] overflow-hidden text-ellipsis whitespace-nowrap">
                {user.name}
              </span>
              &apos;s actions
            </Heading>
            <MenuDivider></MenuDivider>
            <MenuItem icon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}>
              Manage
            </MenuItem>
          </MenuList>
        </Menu>
      );
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          bg={"white"}
        />

        <Menu isLazy placement="bottom-end">
          <MenuButton>
            <Button
              aria-label="columns"
              rightIcon={<ChevronDownIcon className="h-5 w-5" />}
            >
              Columns
            </Button>
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
                    {column.id}
                  </MenuItem>
                );
              })}
          </MenuList>
        </Menu>
      </div>
      <div className="overflow-auto rounded-xl border bg-zinc-50">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-left">
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

      <HStack py={4} justifyContent={"end"}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </HStack>
    </div>
  );
}

function StaffTable() {
  const { data: dataPages } = api.user.getStaff.useInfiniteQuery({});

  const data = useMemo(() => {
    if (dataPages) {
      return dataPages.pages.flatMap((page) => page.items);
    }
  }, [dataPages]);

  if (!data) return;

  return (
    <div>
      <DataTable columns={columns} data={data}></DataTable>
    </div>
  );
}

export default StaffTable;
