import {
  Badge,
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
import { TrashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import Logo from "public/logo-full-transparent.png";
import { Fragment } from "react";
import ManageFeatured from "~/components/ManageFeatured";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/Layout/AdminLayout";
import { api } from "~/utils/api";

function Index() {
  const toast = useToast();

  const getAllFeaturedQuery = api.featured.getAll.useInfiniteQuery(
    { limit: 50 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const deleteFeaturedHook = api.featured.delete.useMutation();

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

  const router = useRouter();

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
                                          src={featured.media[0]?.url || Logo}
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
                            Fetch featureds
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
            </TableContainer>
          </div>
          <Button
            onClick={() => void getAllFeaturedQuery.fetchNextPage()}
            disabled={getAllFeaturedQuery.hasNextPage}
          >
            Fetch
          </Button>
        </div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default Index;
