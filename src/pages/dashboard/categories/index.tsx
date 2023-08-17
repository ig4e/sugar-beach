import {
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  AdjustmentsHorizontalIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import { type Category } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import ManageCategory from "~/components/ManageCategory";
import AuthGaurd from "~/components/base/AuthGaurd";
import DataTable from "~/components/base/DataTable";
import AdminLayout from "~/components/layout/AdminLayout";
import { type RouterInputs, api } from "~/utils/api";

function Index() {
  const toast = useToast();

  const [paginationState, setPaginationState] = useState<
    RouterInputs["category"]["getAll"]
  >({ cursor: 1, limit: 2 });

  const { data, refetch, isLoading } = api.category.getAll.useQuery({
    ...paginationState,
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
          void refetch();
        },
      }
    );
  }

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const category = row.original;

        return (
          <HStack>
            <Text>
              {category.name.en}
              <br />
              {category.name.ar}
            </Text>
          </HStack>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const category = row.original;

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
                Featured actions
              </Heading>
              <MenuDivider></MenuDivider>

              <ManageCategory
                action="edit"
                category={category}
                onRefetch={() => void refetch()}
                trigger={
                  <MenuItem
                    icon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
                  >
                    Manage
                  </MenuItem>
                }
              ></ManageCategory>

              <MenuItem
                onClick={() => deleteCategory(category.id)}
                aria-label="Delete category"
                icon={<TrashIcon className="h-5 w-5"></TrashIcon>}
              >
                Delete
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
            <Heading size={"md"}>Categories</Heading>

            <ManageCategory
              onRefetch={() => void refetch()}
              action="create"
            ></ManageCategory>
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

          {/* <div className="relative">
            {isLoading && <Progress isIndeterminate />}
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
                  {data &&
                    data.pages.map((categoryPage) => {
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
                                      void refetch()
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

                  {hasNextPage && (
                    <Tr>
                      <Td colSpan={4}>
                        <div className="flex items-center justify-center">
                          <Button
                            onClick={() =>
                              void fetchNextPage()
                            }
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
                      {data
                        ? data.pages.reduce(
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
          </div> */}
        </div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default Index;
