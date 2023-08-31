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
} from "@chakra-ui/react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Text } from "@mantine/core";
import { type Product } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import DataTable from "~/components/base/DataTable";
import AdminLayout from "~/components/layout/AdminLayout";
import { LogoLargeDynamicPath } from "~/components/logos";
import { DEFAULT_PAGE_SIZE } from "~/config/commonConfig";
import { PRODUCT_STATUS_COLOR } from "~/config/productConfig";
import { api, type RouterInputs } from "~/utils/api";

function Index() {
  const [paginationState, setPaginationState] = useState<
    RouterInputs["product"]["getAll"]
  >({ cursor: 1, limit: DEFAULT_PAGE_SIZE });

  const { data, isLoading } = api.product.getAll.useQuery({
    ...paginationState,
  });

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        const featuredImage = product.media[0]?.url ?? LogoLargeDynamicPath;

        return (
          <HStack>
            <Avatar
              src={featuredImage}
              name={product.name.en}
              size="sm"
              borderRadius={"md"}
              objectFit={"contain"}
            ></Avatar>
            <Text>
              {product.name.en}
              <br />
              {product.name.ar}
            </Text>
          </HStack>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge colorScheme={PRODUCT_STATUS_COLOR[status]}>{status}</Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const product = row.original;

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

              <MenuItem
                as={Link}
                icon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
                href={`/dashboard/products/${product.id}`}
              >
                Manage
              </MenuItem>
            </MenuList>
          </Menu>
        );
      },
    },
  ];

  return (
    <AuthGaurd allowedLevel="STAFF">
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Heading size={"md"}>Products</Heading>
            <Link href={"/dashboard/products/create"}>
              <Button colorScheme="pink" size="sm">
                Add product
              </Button>
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border">
            <DataTable
              columns={columns}
              data={data?.items ?? []}
              isLoading={isLoading}
              pageInfo={{
                totalPages: data?.totalPages ?? 1,
                nextCursor: data?.nextCursor,
                prevCursor: data?.prevCursor,
              }}
              onPaginationChange={(page) =>
                setPaginationState((state) => ({ ...state, cursor: page }))
              }
            ></DataTable>
          </div>

          {/* 
          <div>
            {getAllProductsQuery.isLoading && <Progress isIndeterminate />}

            <Table className="overflow-hidden rounded-xl bg-white drop-shadow-lg">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getAllProductsQuery.data
                  ? getAllProductsQuery.data.pages.map((productPage) => {
                      return (
                        <Fragment key={productPage.nextCursor}>
                          {productPage.items.map((product) => {
                            return (
                              <TableRow
                                key={product.id}
                                onClick={() =>
                                  void router.push(
                                    `/dashboard/products/${product.id}`
                                  )
                                }
                                className="transition hover:bg-gray-100"
                              >
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 rounded-md border">
                                      <Image
                                        className="h-full w-full rounded-md object-cover"
                                        src={
                                          product.media[0]?.url ||
                                          LogoSmallTransparent
                                        }
                                        alt={product.name.en}
                                        width={100}
                                        height={100}
                                      ></Image>
                                    </div>

                                    <div>
                                      <span>{product.name.en}</span>
                                      <br />
                                      <span>{product.name.ar}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    colorScheme={
                                      product.status === "ACTIVE"
                                        ? "green"
                                        : "red"
                                    }
                                  >
                                    {product.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{product.price} SAR</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                              </TableRow>
                            );
                          })}
                        </Fragment>
                      );
                    })
                  : null}

                {getAllProductsQuery.hasNextPage && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="flex items-center justify-center">
                        <Button
                          onClick={() =>
                            void getAllProductsQuery.fetchNextPage()
                          }
                          size="sm"
                        >
                          Fetch products
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableHeader>
                    {getAllProductsQuery.data
                      ? getAllProductsQuery.data.pages.reduce(
                          (total, current) => (total += current.items.length),
                          0
                        )
                      : "0"}
                    {" Products"}
                  </TableHeader>
                </TableRow>
              </TableFooter>
            </Table>
          </div> */}
        </div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default Index;
