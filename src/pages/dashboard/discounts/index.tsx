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
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import ManageDiscount from "~/components/ManageDiscount";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";
import { api } from "~/utils/api";

function index() {
  const toast = useToast();
  const allDiscountsQuery = api.discount.getAll.useQuery();
  const deleteDiscountHook = api.discount.delete.useMutation();

  function deleteDiscount(id: string) {
    deleteDiscountHook.mutate(
      { id },
      {
        onSuccess: ({ code }) => {
          allDiscountsQuery.refetch();
          toast({
            status: "success",
            title: `Deleted ${code} successfully`,
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
            <Heading size={"md"}>Discounts</Heading>
            <ManageDiscount
              action="create"
              onRefetch={() => allDiscountsQuery.refetch()}
            ></ManageDiscount>
          </div>

          <div className="relative">
            {allDiscountsQuery.isLoading && <Progress isIndeterminate />}
            <TableContainer>
              <Table
                size="md"
                colorScheme="pink"
                bg={"white"}
                borderRadius={"md"}
              >
                <Thead>
                  <Tr>
                    <Th isTruncated>Code</Th>
                    <Th isTruncated>Amount</Th>
                    <Th isTruncated>Expiers At</Th>
                    <Th isNumeric>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {allDiscountsQuery.data &&
                    allDiscountsQuery.data.map(
                      (discount) =>
                        discount && (
                          <Tr key={discount.id}>
                            <Td isTruncated>
                              <span>{discount.code}</span>
                            </Td>
                            <Td isTruncated>
                              <span>
                                {discount.precentage
                                  ? `%${discount.precentage}`
                                  : `${discount.fixedAmount} SAR`}
                              </span>
                            </Td>
                            <Td isTruncated>
                              {dayjs(discount.expiresAt).format("DD/MM/YYYY")}
                            </Td>
                            <Td>
                              <HStack className="justify-end">
                                <ManageDiscount
                                  action="edit"
                                  discount={discount}
                                  onRefetch={() => allDiscountsQuery.refetch()}
                                ></ManageDiscount>
                                <IconButton
                                  onClick={() => deleteDiscount(discount.id)}
                                  aria-label="Delete discount"
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
                    <Th>{allDiscountsQuery.data?.length || 0} Discounts</Th>
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
