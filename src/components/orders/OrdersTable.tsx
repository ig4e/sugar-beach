import type { OrderStatus } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

import {
  Badge,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  Tabs,
} from "@chakra-ui/react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { LoadingOverlay, Pagination } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useState } from "react";
import {
  INVOICE_STATUS,
  INVOICE_STATUS_COLOR,
  ORDER_STATUS,
  ORDER_STATUS_COLOR,
} from "~/config/ordersConfig";
import useCurrency from "~/hooks/useCurrency";
import useDayjs from "~/hooks/useDayjs";
import { type RouterInputs, type RouterOutputs, api } from "~/utils/api";
import DataTable from "../base/DataTable";
import { DEFAULT_PAGE_SIZE } from "~/config/commonConfig";

type OrderType = RouterOutputs["order"]["getOrders"]["items"][0];

const columns: ColumnDef<OrderType>[] = [
  {
    header: "ID",
    accessorKey: "number",
    cell: ({ renderValue }) => {
      return <span>#{renderValue<number>()}</span>;
    },
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

      return (
        <span suppressHydrationWarning className="whitespace-nowrap">
          {dayjs(props.getValue() as string).format("hh:mm:s a MMMM D, YYYY")}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { t } = useTranslation("common");

      const status = row.original.status;

      const orderStatusColorScheme = ORDER_STATUS_COLOR[status];

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

      const status = row.original?.invoice?.status;
      const invoiceColorScheme = status && INVOICE_STATUS_COLOR[status];

      return (
        <Badge colorScheme={invoiceColorScheme}>
          {t(`paymentStatus.${status ?? ""}`)}
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
            <Link href={`/dashboard/orders/${order.id}`}>
              <MenuItem
                icon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
              >
                Manage
              </MenuItem>
            </Link>
          </MenuList>
        </Menu>
      );
    },
  },
];

export default function OrdersTable() {
  const [pageState, setPageState] = useState<
    RouterInputs["order"]["getOrders"]
  >({ cursor: 1, status: "ALL", invoiceStatus: "ALL", limit: DEFAULT_PAGE_SIZE });

  const { t } = useTranslation("common");
  const { data, isLoading } = api.order.getOrders.useQuery(pageState);

  return (
    <div className="rounded-xl border bg-zinc-50">
      <div className="z-10 rounded-xl bg-zinc-50">
        <div className="overflow-x-auto border-b px-2 py-2">
          <Tabs variant={"soft-rounded"}>
            <TabList>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Tab
                  key={"ALL"}
                  onClick={() =>
                    setPageState((state) => ({
                      ...state,
                      cursor: 1,
                      status: "ALL",
                    }))
                  }
                  fontSize={"sm"}
                  borderRadius={"lg"}
                >
                  {t("common:orderStatus.ALL")}إ
                </Tab>
                {ORDER_STATUS.map((status) => (
                  <Tab
                    key={status}
                    onClick={() =>
                      setPageState((state) => ({ ...state, cursor: 1, status }))
                    }
                    whiteSpace={"nowrap"}
                    fontSize={"sm"}
                    borderRadius={"lg"}
                  >
                    {t(`common:orderStatus.${status}`)}
                  </Tab>
                ))}
              </div>
            </TabList>
          </Tabs>
        </div>

        <div className="overflow-x-auto border-b px-2 py-2">
          <Tabs variant={"soft-rounded"}>
            <TabList>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Tab
                  key={"ALL"}
                  onClick={() =>
                    setPageState((state) => ({
                      ...state,
                      cursor: 1,
                      invoiceStatus: "ALL",
                    }))
                  }
                  fontSize={"sm"}
                  borderRadius={"lg"}
                >
                  {t("orderStatus.ALL")}إ
                </Tab>

                {INVOICE_STATUS.map((status) => (
                  <Tab
                    key={status}
                    onClick={() =>
                      setPageState((state) => ({
                        ...state,
                        cursor: 1,
                        invoiceStatus: status,
                      }))
                    }
                    whiteSpace={"nowrap"}
                    fontSize={"sm"}
                    borderRadius={"lg"}
                  >
                    {t(`paymentStatus.${status}`)}
                  </Tab>
                ))}
              </div>
            </TabList>
          </Tabs>
        </div>
      </div>

      <div className="relative">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          pageInfo={{
            totalPages: data?.totalPages ?? 1,
            nextCursor: data?.nextCursor,
            prevCursor: data?.nextCursor,
          }}
          onPaginationChange={(page) =>
            setPageState((state) => ({ ...state, cursor: page }))
          }
          isLoading={isLoading}
        ></DataTable>
      </div>
    </div>
  );
}
