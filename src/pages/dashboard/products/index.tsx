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
} from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";

function index() {
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
                  </Tr>
                </Thead>
                <Tbody></Tbody>
                <Tfoot>
                  <Tr>
                    <Th>0 Products</Th>
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
