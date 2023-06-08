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
import React from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";
import { api } from "~/utils/api";
import Logo from "public/logo-full-transparent.png";

function index() {
  const getAllProductsQuery = api.product.getAll.useQuery();

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
                size="md"
                colorScheme="pink"
                bg={"white"}
                borderRadius={"md"}
              >
                <Thead>
                  <Tr>
                    <Th>Image</Th>
                    <Th isTruncated>Name</Th>
                    <Th>Status</Th>
                    <Th isNumeric>Quantity</Th>
                    <Th isNumeric>Price</Th>
                    <Th isNumeric>Compare At Price</Th>
                    <Th isNumeric>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {getAllProductsQuery.data
                    ? getAllProductsQuery.data.map((product) => {
                        return (
                          <Tr key={product.id}>
                            <Td>
                              <Image
                                src={product.media[0] || Logo}
                                alt={product.name.en}
                                width={100}
                                height={100}
                              ></Image>
                            </Td>
                            <Td>
                              <span>{product.name.en}</span>
                              <br />
                              <span>{product.name.ar}</span>
                            </Td>
                            <Td isTruncated>
                              <Badge
                                colorScheme={
                                  product.status === "ACTIVE" ? "green" : "red"
                                }
                              >
                                {product.status}
                              </Badge>
                            </Td>
                            <Td isNumeric>{product.quantity}</Td>
                            <Td isNumeric>{product.price} SAR</Td>
                            <Td isNumeric>{product.compareAtPrice} SAR</Td>
                            <Td>
                              <HStack className="justify-end">
                                <IconButton
                                  aria-label="Edit product"
                                  icon={
                                    <PencilIcon className="h-5 w-5"></PencilIcon>
                                  }
                                  colorScheme={"pink"}
                                ></IconButton>
                                <IconButton
                                  aria-label="Delete product"
                                  icon={
                                    <TrashIcon className="h-5 w-5"></TrashIcon>
                                  }
                                  colorScheme={"red"}
                                ></IconButton>
                              </HStack>
                            </Td>
                          </Tr>
                        );
                      })
                    : null}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>
                      {getAllProductsQuery.data
                        ? getAllProductsQuery.data.length
                        : "0"}{" "}
                      Products
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
