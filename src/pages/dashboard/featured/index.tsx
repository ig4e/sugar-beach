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
  useToast,
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
import ManageFeatured from "~/components/ManageFeatured";

function index() {
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
          getAllFeaturedQuery.refetch();
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
              onRefetch={getAllFeaturedQuery.refetch}
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
                                        onRefetch={getAllFeaturedQuery.refetch}
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
                            onClick={() => getAllFeaturedQuery.fetchNextPage()}
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
            onClick={() => getAllFeaturedQuery.fetchNextPage()}
            disabled={getAllFeaturedQuery.hasNextPage}
          >
            Fetch
          </Button>
        </div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default index;
