import type { Order, OrderInvoice, OrderStatus } from "@prisma/client";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RouterInputs, RouterOutputs, api } from "~/utils/api";
import { useState } from "react";
import useDayjs from "~/hooks/useDayjs";
import {
  Badge,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Tab,
  TabList,
  Tabs,
} from "@chakra-ui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import useCurrency from "~/hooks/useCurrency";
import { ORDER_STATUS } from "~/config/ordersConfig";
import useTranslation from "next-translate/useTranslation";
import { LoadingOverlay } from "@mantine/core";

type OrderType = RouterOutputs["order"]["getOrders"]["items"][0];

export const columns: ColumnDef<OrderType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    header: "Customer",
    accessorKey: "user.name",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell(props) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const dayjs = useDayjs();

      return dayjs(props.getValue() as string).format("MMMM D, YYYY");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { t } = useTranslation("common");

      const status = row.original.status;

      const processing: OrderStatus[] = ["ORDER_PLACED", "PROCESSING"];
      const cancelled: OrderStatus[] = ["CANCELLED", "REFUNDED"];
      const shipping: OrderStatus[] = ["PREPARING_TO_SHIP", "SHIPPED"];
      const delivered: OrderStatus[] = ["DELIVERED"];

      const orderStatusColorScheme = processing.includes(status)
        ? "gray"
        : cancelled.includes(status)
        ? "red"
        : shipping.includes(status)
        ? "yellow"
        : delivered.includes(status)
        ? "green"
        : "gray";

      return (
        <Badge colorScheme={orderStatusColorScheme}>
          {t(`orderStatus.${status}`)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell(props) {
      const total = props.getValue() as number;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const currency = useCurrency();
      return currency(total).format();
    },
  },
  {
    accessorKey: "invoice.status",
    header: "Payment Status",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { t } = useTranslation("common");

      const status = row.original.invoice.status;
      const invoiceColorScheme =
        status === "PAID" ? "green" : status === "CANCELLED" ? "red" : "gray";
      return (
        <Badge colorScheme={invoiceColorScheme}>
          {t(`paymentStatus.${status}`)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => {
      const order = row.original;

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
              Order actions
            </Heading>
            <MenuDivider></MenuDivider>
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

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function OrdersTable() {
  const [pageState, setPageState] = useState<
    RouterInputs["order"]["getOrders"]
  >({ cursor: 1, status: "ALL" });

  const { t } = useTranslation("common");
  const { data, isLoading } = api.order.getOrders.useQuery(pageState);

  console.log(data);

  return (
    <div className="rounded-md border bg-zinc-50">
      <div className="border-b px-2 py-2">
        <Tabs variant={"soft-rounded"}>
          <TabList>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Tab
                key={"ALL"}
                onClick={() => setPageState({ status: "ALL" })}
                borderRadius={"md"}
              >
                {t("orderStatus.ALL")}
              </Tab>
              {ORDER_STATUS.map((status) => (
                <Tab
                  key={status}
                  onClick={() => setPageState({ status })}
                  borderRadius={"md"}
                  whiteSpace={"nowrap"}
                >
                  {t(`orderStatus.${status}`)}
                </Tab>
              ))}
            </div>
          </TabList>
        </Tabs>
      </div>
      <div className="relative">
        <LoadingOverlay visible={isLoading}></LoadingOverlay>
        <DataTable columns={columns} data={data?.items ?? []} />
      </div>
    </div>
  );
}
