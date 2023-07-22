import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CenteredLayout from "~/components/layout/CenteredLayout";
import { LogoSmallTransparent } from "~/components/logos";

import useTranslation from "next-translate/useTranslation";
import { api } from "~/utils/api";
import { Loader } from "@mantine/core";

function ProcessOrder() {
  const session = useSession();
  const router = useRouter();
  const { paymentId } = router.query;
  const { t } = useTranslation("processOrder");

  const { mutate, isLoading, error, data, isIdle } =
    api.order.updateOrderPaymentStatus.useMutation({
      onSuccess(data) {
        if (!data) return;

        if (data.status === "PAID") {
          void router.push(
            `/@me/orders${data.order ? "#" + data.order?.id : ""}`
          );
        }
      },
    });

  useEffect(() => {
    mutate({ id: paymentId as string });
  }, [paymentId]);

  const isSuccess = !isLoading && !error && data && data.status === "PAID";

  return (
    <CenteredLayout>
      <div className="space-y-8 rounded-md bg-zinc-50 p-8 md:mx-16">
        <header>
          <Link href="/">
            <Image
              src={LogoSmallTransparent}
              alt="logo"
              width={100}
              height={100}
            ></Image>
          </Link>
        </header>

        <div className="mx-auto max-w-lg space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">
              Processing your order.
            </h1>
            <p>
              Once we process your order, you will be redirected to your orders.
              please wait and don&apos;t close this page
            </p>
          </div>

          {isLoading || isIdle ? (
            <Alert status="info">
              <div className="pe-4">
                <Loader color="blue" size={"sm"}></Loader>
              </div>
              <AlertTitle>Processing your order</AlertTitle>
              <AlertDescription>Please wait...</AlertDescription>
            </Alert>
          ) : (
            <Alert status={isSuccess ? "success" : "error"}>
              <VStack alignItems="start">
                <HStack spacing={0}>
                  <AlertIcon />
                  <AlertTitle>
                    {isSuccess ? "Payment successful" : "Payment failed"}
                  </AlertTitle>
                </HStack>
                <AlertDescription>
                  {isSuccess
                    ? "Payment successful you will be redirected to your orders"
                    : "Your payment has failed. Please try again or contact us if the problem persists."}
                </AlertDescription>
              </VStack>
            </Alert>
          )}

          <div>
            <span>© 2023 Sugar Beach</span>
          </div>
        </div>
      </div>
    </CenteredLayout>
  );
}

export default ProcessOrder;
