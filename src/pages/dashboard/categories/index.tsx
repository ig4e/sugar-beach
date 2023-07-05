import {
  Button,
  HStack,
  Heading,
  IconButton,
  Progress,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast
} from "@chakra-ui/react";
import {
  TrashIcon
} from "@heroicons/react/24/solid";
import { Fragment } from "react";
import ManageCategory from "~/components/ManageCategory";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";
import { api } from "~/utils/api";

function Index() {
  const toast = useToast();
  const allCategoriesQuery = api.category.getAll.useInfiniteQuery({
    limit: 100,
  });
  const deleteCategoryHook = api.category.delete.useMutation();

  function deleteCategory(id: string) {
    deleteCategoryHook.mutate(
      { id },
      {
        onSuccess: ({ name }) => {
          toast({
            status: "success",
            title: `Deleted ${name.en} successfully`,
          });
          void allCategoriesQuery.refetch();
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
              onRefetch={() => void allCategoriesQuery.refetch()}
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
                    allCategoriesQuery.data.pages.map((categoryPage) => {
                      return (
                        <Fragment key={categoryPage.nextCursor}>
                          {categoryPage.items.map((category) => (
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
                                    onRefetch={() =>
                                      void allCategoriesQuery.refetch()
                                    }
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
                          ))}
                        </Fragment>
                      );
                    })}

                  {allCategoriesQuery.hasNextPage && (
                    <Tr>
                      <Td colSpan={4}>
                        <div className="flex items-center justify-center">
                          <Button
                            onClick={() => void allCategoriesQuery.fetchNextPage()}
                            size="sm"
                          >
                            Fetch categories
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>
                      {allCategoriesQuery.data
                        ? allCategoriesQuery.data.pages.reduce(
                            (total, current) => (total += current.items.length),
                            0
                          )
                        : 0}{" "}
                      Categories
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

export default Index;
