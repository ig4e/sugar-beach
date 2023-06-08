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
  useToast,
} from "@chakra-ui/react";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";
import ManageCategory from "~/components/ManageCategory";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";
import { api } from "~/utils/api";

function index() {
  const toast = useToast();
  const allCategoriesQuery = api.category.getAll.useQuery();
  const deleteCategoryHook = api.category.delete.useMutation();

  function deleteCategory(id: string) {
    deleteCategoryHook.mutate(
      { id },
      {
        onSuccess: ({ name }) => {
          allCategoriesQuery.refetch();
          toast({
            status: "success",
            title: `Deleted ${name.en} successfully`,
          });
        },
      }
    );
  }

  return (
    <AuthGaurd allowedLevel="STAFF">
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Heading size={"md"}>Categories</Heading>

            <ManageCategory
              onRefetch={() => allCategoriesQuery.refetch()}
              action="create"
            ></ManageCategory>
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
                            <Td isTruncated>
                              <span>{category.name.en}</span>
                              <br />
                              <span>{category.name.ar}</span>
                            </Td>
                            <Td>
                              <HStack className="justify-end">
                                <ManageCategory
                                  action="edit"
                                  category={category}
                                  onRefetch={() => allCategoriesQuery.refetch()}
                                ></ManageCategory>
                                <IconButton
                                  onClick={() => deleteCategory(category.id)}
                                  aria-label="Delete category"
                                  icon={
                                    <TrashIcon className="h-5 w-5"></TrashIcon>
                                  }
                                  colorScheme={"red"}
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
