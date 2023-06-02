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
  HStack,
  IconButton,
} from "@chakra-ui/react";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";
import CreateCategory from "~/components/CreateCategory";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";
import { api } from "~/utils/api";

function index() {
  const allCategoriesQuery = api.category.getAll.useQuery();

  return (
    <AuthGaurd allowedLevel="STAFF">
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Heading size={"md"}>Categories</Heading>

            <CreateCategory
              onRefetch={() => allCategoriesQuery.refetch()}
            ></CreateCategory>
          </div>

          <div className="relative">
            {allCategoriesQuery.isLoading && <Progress isIndeterminate />}
            <TableContainer>
              <Table
                size="md"
                colorScheme="pink"
                bg={"white"}
                borderRadius={"md"}
              >
                <Thead>
                  <Tr>
                    <Th isTruncated>Name</Th>
                    <Th isNumeric>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {allCategoriesQuery.data &&
                    allCategoriesQuery.data.map(
                      (category) =>
                        category && (
                          <Tr key={category.id}>
                            <Td isTruncated className="flex flex-col gap-2">
                              <span>{category.name.en}</span>
                              <span>{category.name.ar}</span>
                            </Td>
                            <Td>
                              <HStack className="justify-end">
                                <IconButton
                                  aria-label="Delete category"
                                  icon={
                                    <TrashIcon className="h-5 w-5"></TrashIcon>
                                  }
                                  colorScheme={"red"}
                                ></IconButton>
                                <IconButton
                                  aria-label="Edit category"
                                  icon={
                                    <PencilSquareIcon className="h-5 w-5"></PencilSquareIcon>
                                  }
                                ></IconButton>
                              </HStack>
                            </Td>
                          </Tr>
                        )
                    )}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>{allCategoriesQuery.data?.length || 0} Categories</Th>
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
