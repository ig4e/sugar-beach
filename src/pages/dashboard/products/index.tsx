import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Progress,
  Badge,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";
import { api } from "~/utils/api";
import Logo from "public/logo-full-transparent.png";
import { useRouter } from "next/router";

function index() {
  const utils = api.useContext();

  const getAllProductsQuery = api.product.getAll.useInfiniteQuery(
    { limit: 100 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  utils.product.getAll.getInfiniteData();

  const router = useRouter();
  return (
    <AuthGaurd allowedLevel="STAFF">
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Heading size={"md"}>Products</Heading>
            <Link href={"/dashboard/products/create"}>
              <Button colorScheme="pink">Add product</Button>
            </Link>
          </div>

          <div>
            {getAllProductsQuery.isLoading && <Progress isIndeterminate />}

            <TableContainer>
              <Table
                className="drop-shadow-lg"
                size="sm"
                colorScheme="pink"
                bg={"white"}
                borderRadius={"md"}
              >
                <Thead>
                  <Tr>
                    <Th>Product</Th>
                    <Th>Status</Th>
                    <Th>Price</Th>
                    <Th isNumeric>Quantity</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {getAllProductsQuery.data
                    ? getAllProductsQuery.data.pages.map((productPage) => {
                        return (
                          <Fragment key={productPage.nextCursor}>
                            {productPage.items.map((product) => {
                              return (
                                <Tr
                                  key={product.id}
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/products/${product.id}`
                                    )
                                  }
                                  className="transition hover:bg-gray-100"
                                >
                                  <Td>
                                    <div className="flex items-center gap-2">
                                      <div className="h-10 w-10 rounded-md border">
                                        <Image
                                          className="h-full w-full rounded-md object-cover"
                                          src={product.media[0]?.url || Logo}
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
                                  </Td>
                                  <Td isTruncated>
                                    <Badge
                                      colorScheme={
                                        product.status === "ACTIVE"
                                          ? "green"
                                          : "red"
                                      }
                                    >
                                      {product.status}
                                    </Badge>
                                  </Td>
                                  <Td>{product.price} SAR</Td>
                                  <Td isNumeric>{product.quantity}</Td>
                                </Tr>
                              );
                            })}
                          </Fragment>
                        );
                      })
                    : null}

                  {getAllProductsQuery.hasNextPage && (
                    <Tr>
                      <Td colSpan={4}>
                        <div className="flex items-center justify-center">
                          <Button
                            onClick={() => getAllProductsQuery.fetchNextPage()}
                            size="sm"
                          >
                            Fetch products
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>
                      {getAllProductsQuery.data
                        ? getAllProductsQuery.data.pages.reduce(
                            (total, current) => (total += current.items.length),
                            0
                          )
                        : "0"}
                      {" Products"}
                    </Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </div>
        </div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default index;
