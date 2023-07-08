import {
  Badge,
  Button,
  Heading,
  Progress,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";
import { LogoSmallTransparent } from "~/components/logos";
import { api } from "~/utils/api";

function Index() {
  const utils = api.useContext();

  const getAllProductsQuery = api.product.getAll.useInfiniteQuery(
    { limit: 100 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  utils.product.getAll.getInfiniteData();

  const router = useRouter();

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
                    <Th>Price</Th>
                    <Th isNumeric>Quantity</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {getAllProductsQuery.data
                    ? getAllProductsQuery.data.pages.map((productPage) => {
                        return (
                          <Fragment key={productPage.nextCursor}>
                            {productPage.items.map((product) => {
                              return (
                                <Tr
                                  key={product.id}
                                  onClick={() =>
                                    void router.push(
                                      `/dashboard/products/${product.id}`
                                    )
                                  }
                                  className="transition hover:bg-gray-100"
                                >
                                  <Td>
                                    <div className="flex items-center gap-2">
                                      <div className="h-10 w-10 rounded-md border">
                                        <Image
                                          className="h-full w-full rounded-md object-cover"
                                          src={
                                            product.media[0]?.url ||
                                            LogoSmallTransparent
                                          }
                                          alt={product.name.en}
                                          width={100}
                                          height={100}
                                        ></Image>
                                      </div>

                                      <div>
                                        <span>{product.name.en}</span>
                                        <br />
                                        <span>{product.name.ar}</span>
                                      </div>
                                    </div>
                                  </Td>
                                  <Td isTruncated>
                                    <Badge
                                      colorScheme={
                                        product.status === "ACTIVE"
                                          ? "green"
                                          : "red"
                                      }
                                    >
                                      {product.status}
                                    </Badge>
                                  </Td>
                                  <Td>{product.price} SAR</Td>
                                  <Td isNumeric>{product.quantity}</Td>
                                </Tr>
                              );
                            })}
                          </Fragment>
                        );
                      })
                    : null}

                  {getAllProductsQuery.hasNextPage && (
                    <Tr>
                      <Td colSpan={4}>
                        <div className="flex items-center justify-center">
                          <Button
                            onClick={() =>
                              void getAllProductsQuery.fetchNextPage()
                            }
                            size="sm"
                          >
                            Fetch products
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>
                      {getAllProductsQuery.data
                        ? getAllProductsQuery.data.pages.reduce(
                            (total, current) => (total += current.items.length),
                            0
                          )
                        : "0"}
                      {" Products"}
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

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || "en";

  const messages = (await import(
    `public/locales/${locale}.json`
  )) as unknown as { default: Messages };

  return {
    props: {
      messages: messages.default,
    },
  };
};
export default Index;
