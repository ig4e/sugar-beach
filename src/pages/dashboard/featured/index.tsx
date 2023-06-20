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
import ManageFeatured from "~/components/ManageFeatured";

function index() {
  const getAllFeaturedQuery = api.featured.getAll.useInfiniteQuery(
    { limit: 50 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

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
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/featured/${featured.id}`
                                    )
                                  }
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
                                </Tr>
                              );
                            })}
                          </Fragment>
                        );
                      })
                    : null}
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
