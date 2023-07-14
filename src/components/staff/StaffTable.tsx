import React, { useMemo } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnFiltersState,
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
  Avatar,
  Badge,
  Button,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";

import {
  AdjustmentsHorizontalIcon,
  CheckIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import type { User } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { api } from "~/utils/api";
import Input from "../base/Input";
import { LogoLargeDynamicPath } from "../logos";
import { LoadingOverlay } from "@mantine/core";
import ManageStaff from "./ManageStaff";

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
      <div className="flex items-center justify-between gap-4 py-4">
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
          <MenuButton
            as={Button}
            colorScheme="gray"
            rightIcon={<ChevronDownIcon className="h-5 w-5" />}
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
  const { data: dataPages, refetch } = api.user.getStaff.useInfiniteQuery({});
  const columns: ColumnDef<User>[] = [
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
        const role = row.original.role;
        return (
          <Badge colorScheme={role === "ADMIN" ? undefined : "purple"}>
            {row.renderValue("role")}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <Menu placement="bottom-end">
            <MenuButton
              w={"fit-content"}
              as={IconButton}
              size="sm"
              aria-label="actions"
              colorScheme="gray"
              icon={
                <EllipsisHorizontalIcon className="h-5 w-5"></EllipsisHorizontalIcon>
              }
            ></MenuButton>
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
              <ManageStaff
                onRefetch={() => void refetch()}
                trigger={
                  <MenuItem
                    icon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
                  >
                    Manage
                  </MenuItem>
                }
                userId={user.id}
              ></ManageStaff>
            </MenuList>
          </Menu>
        );
      },
    },
  ];

  const data = useMemo(() => {
    if (dataPages) {
      return dataPages.pages.flatMap((page) => page.items);
    }
  }, [dataPages]);

  if (!data)
    return (
      <div className="relative min-h-[25rem]">
        <LoadingOverlay visible overlayBlur={2}></LoadingOverlay>
      </div>
    );

  return (
    <div className="">
      <DataTable columns={columns} data={data}></DataTable>
    </div>
  );
}

export default StaffTable;
