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
  Progress,
  Text,
  useToast
} from "@chakra-ui/react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid";
import { EllipsisHorizontalIcon, TrashIcon } from "@heroicons/react/24/solid";
import type { Featured, Product } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import ManageFeatured from "~/components/ManageFeatured";
import AuthGaurd from "~/components/base/AuthGaurd";
import DataTable from "~/components/base/DataTable";
import AdminLayout from "~/components/layout/AdminLayout";
import { LogoLargeDynamicPath } from "~/components/logos";
import { api } from "~/utils/api";

function Index() {
  const toast = useToast();

  const getAllFeaturedQuery = api.featured.getAll.useQuery({ limit: 50 });

  const deleteFeaturedHook = api.featured.delete.useMutation();

  const columns: ColumnDef<Featured & { product: Product }>[] = [
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original.product;
        const featuredImage =
          row.original.media[0]?.url ?? LogoLargeDynamicPath;

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
        return <Badge colorScheme={"green"}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const featured = row.original;

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

              <ManageFeatured
                onRefetch={() => void getAllFeaturedQuery.refetch()}
                action="edit"
                featured={featured}
                trigger={
                  <MenuItem
                    icon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
                  >
                    Manage
                  </MenuItem>
                }
              ></ManageFeatured>

              <MenuItem
                onClick={() => deleteFeatured(featured.id)}
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

  function deleteFeatured(id: string) {
    deleteFeaturedHook.mutate(
      { id },
      {
        onSuccess: ({}) => {
          void getAllFeaturedQuery.refetch();
          toast({
            status: "success",
            title: `Deleted featured successfully`,
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
            <Heading size={"md"}>Featured</Heading>
            <ManageFeatured
              onRefetch={() => void getAllFeaturedQuery.refetch()}
              action="create"
            ></ManageFeatured>
          </div>

          <div>
            {getAllFeaturedQuery.isLoading && <Progress isIndeterminate />}

            <div className="overflow-hidden rounded-xl border">
              <DataTable
                columns={columns}
                data={getAllFeaturedQuery.data?.items ?? []}
              ></DataTable>
            </div>

            {/* <TableContainer>
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
                    <Th isNumeric>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {getAllFeaturedQuery.data
                    ? getAllFeaturedQuery.data.pages.map((featuredPage) => {
                        return (
                          <Fragment key={featuredPage.nextCursor}>
                            {featuredPage.items.map((featured) => {
                              return (
                                <Tr
                                  key={featured.id}
                                  className="transition hover:bg-gray-100"
                                >
                                  <Td>
                                    <div className="flex items-center gap-2">
                                      <div className="h-10 w-10 rounded-md border">
                                        <Image
                                          className="h-full w-full rounded-md object-cover"
                                          src={
                                            featured.media[0]?.url ||
                                            LogoSmallTransparent
                                          }
                                          alt={featured.product.name.en}
                                          width={100}
                                          height={100}
                                        ></Image>
                                      </div>

                                      <div>
                                        <span>{featured.product.name.en}</span>
                                        <br />
                                        <span>{featured.product.name.ar}</span>
                                      </div>
                                    </div>
                                  </Td>
                                  <Td isTruncated>
                                    <Badge
                                      colorScheme={
                                        featured.status === "ACTIVE"
                                          ? "green"
                                          : "red"
                                      }
                                    >
                                      {featured.status}
                                    </Badge>
                                  </Td>
                                  <Td isNumeric>
                                    <HStack className="justify-end">
                                      <ManageFeatured
                                        onRefetch={() =>
                                          void getAllFeaturedQuery.refetch()
                                        }
                                        action="edit"
                                        featured={featured}
                                      ></ManageFeatured>
                                      <IconButton
                                        onClick={() =>
                                          deleteFeatured(featured.id)
                                        }
                                        aria-label="Delete category"
                                        icon={
                                          <TrashIcon className="h-5 w-5"></TrashIcon>
                                        }
                                        colorScheme={"red"}
                                      ></IconButton>
                                    </HStack>
                                  </Td>
                                </Tr>
                              );
                            })}
                          </Fragment>
                        );
                      })
                    : null}

                  {getAllFeaturedQuery.hasNextPage && (
                    <Tr>
                      <Td colSpan={4}>
                        <div className="flex items-center justify-center">
                          <Button
                            onClick={() =>
                              void getAllFeaturedQuery.fetchNextPage()
                            }
                            size="sm"
                          >
                            Fetch more
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>
                      {getAllFeaturedQuery.data
                        ? getAllFeaturedQuery.data.pages.reduce(
                            (total, current) => (total += current.items.length),
                            0
                          )
                        : "0"}
                      {" Featured"}
                    </Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer> */}
          </div>
        </div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default Index;
