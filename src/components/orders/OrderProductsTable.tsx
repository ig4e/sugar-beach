import {
  Avatar,
  Badge,
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
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";
import { LoadingOverlay } from "@mantine/core";
import { Product, ProductOnOrder } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { PRODUCT_ON_ORDER_STATUS_COLOR } from "~/config/ordersConfig";
import useCurrency from "~/hooks/useCurrency";
import { api } from "~/utils/api";
import DataTable from "../base/DataTable";
import { LogoLargeDynamicPath } from "../logos";

type OrderProductsType = ProductOnOrder & { product: Product };

const columns: ColumnDef<OrderProductsType>[] = [
  {
    header: "Name",
    accessorKey: "product.name.en",
    cell: ({ row, renderValue }) => {
      const product = row.original.product;
      const productImage = product?.media?.[0]?.url ?? LogoLargeDynamicPath;

      return (
        <HStack>
          <Avatar
            src={productImage}
            name={product.name.en}
            size="sm"
            borderRadius={"md"}
          ></Avatar>
          <Text>{renderValue<string>()}</Text>
        </HStack>
      );
    },
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { t } = useTranslation("common");

      const status = row.original.status;
      const colorScheme = PRODUCT_ON_ORDER_STATUS_COLOR[status];

      return (
        <Badge colorScheme={colorScheme}>
          {t(`productOnOrderStatus.${status}`)}
        </Badge>
      );
    },
  },
  {
    header: "Total",
    accessorKey: "price",
    cell(props) {
      const productOnOrder = props.row.original;
      const total = props.getValue() as number;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const currency = useCurrency();
      return currency(total).multiply(productOnOrder.quantity).format();
    },
  },
  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => {
      const productOnOrder = row.original;

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
              Product actions
            </Heading>
            <MenuDivider></MenuDivider>
            <Link href={`/dashboard/products/${productOnOrder.product.id}`}>
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

function OrderProductsTable({ orderId }: { orderId: string }) {
  const { t } = useTranslation("common");
  const { data, isLoading } = api.order.getOrder.useQuery({ id: orderId });
  const products = data?.products;

  return (
    <div className="relative rounded-xl border bg-zinc-50">
      <div className="relative">
        <DataTable
          columns={columns}
          data={products ?? []}
          pageInfo={{ totalPages: 1 }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default OrderProductsTable;
