import {
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
  useToast,
} from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import ManageDiscount from "~/components/ManageDiscount";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";
import { api } from "~/utils/api";

import useTranslation from "next-translate/useTranslation";

function Index() {
  const toast = useToast();
  const allDiscountsQuery = api.discount.getAll.useQuery();
  const deleteDiscountHook = api.discount.delete.useMutation();
  const { t } = useTranslation("adminDiscounts");

  function deleteDiscount(id: string) {
    deleteDiscountHook.mutate(
      { id },
      {
        onSuccess: ({ code }) => {
          void allDiscountsQuery.refetch();
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
            <Heading size={"md"}>{t("discounts")}</Heading>
            <ManageDiscount
              action="create"
              onRefetch={() => void allDiscountsQuery.refetch()}
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
                    <Th isTruncated>{t("code")}</Th>
                    <Th isTruncated>{t("amount")}</Th>
                    <Th isTruncated>{t("expires-at")}</Th>
                    <Th isNumeric>{t("actions")}</Th>
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
                                  : discount.fixedAmount
                                  ? `${discount.fixedAmount} SAR`
                                  : "0 SAR"}
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
                                  onRefetch={() =>
                                    void allDiscountsQuery.refetch()
                                  }
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
                    <Th>
                      {allDiscountsQuery.data?.length || 0} {t("discounts")}
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
