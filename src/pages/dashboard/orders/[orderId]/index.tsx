import {
  HStack,
  Text,
  VStack,
  Heading,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import { SkeletonContext, SkeletonWrap } from "~/components/base/SkeletonWrap";
import AdminLayout from "~/components/layout/AdminLayout";
import useDayjs from "~/hooks/useDayjs";
import { api } from "~/utils/api";

function OrderPage() {
  const router = useRouter();
  const orderId = router.query.orderId as string;
  const { data, isLoading } = api.order.getOrder.useQuery({ id: orderId });
  const dayjs = useDayjs();
  const { t: cT } = useTranslation("common");

  return (
    <SkeletonContext.Provider value={isLoading}>
      <AuthGaurd allowedLevel="STAFF">
        <AdminLayout>
          <div className="space-y-4">
            <HStack w="full" spacing={4} alignItems={"start"}>
              <Link href={"/dashboard/orders"}>
                <IconButton
                  variant={"outline"}
                  icon={<ArrowLeftIcon className="h-5 w-5"></ArrowLeftIcon>}
                  aria-label="back"
                  colorScheme="pink"
                />
              </Link>
              <VStack alignItems={"start"}>
                <SkeletonWrap>
                  <HStack>
                    <Heading size={"md"}>#{data?.number}</Heading>
                    <Badge>
                      {cT("paymentStatus." + (data?.invoice.status ?? ""))}
                    </Badge>
                  </HStack>

                  <Text fontSize={"sm"}>
                    {dayjs(data?.createdAt).format("MMMM D, YYYY")} at{" "}
                    {dayjs(data?.createdAt).format("h:mm a")}
                  </Text>
                </SkeletonWrap>
              </VStack>
            </HStack>
          </div>
        </AdminLayout>
      </AuthGaurd>
    </SkeletonContext.Provider>
  );
}

export default OrderPage;
