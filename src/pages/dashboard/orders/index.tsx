import { HStack, Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";
import OrdersTable from "~/components/orders/OrdersTable";

function Orders() {
  return (
    <AuthGaurd allowedLevel="STAFF">
      <AdminLayout>
        <div className="space-y-4">
          <VStack alignItems={"start"}>
            <HStack justifyContent={"space-between"} w="full">
              <Heading size={"md"}>Orders</Heading>
            </HStack>
            <Text>
              This is where you’ll fulfill orders, collect payments, and track
              order progress.
            </Text>
          </VStack>

          <OrdersTable></OrdersTable>
        </div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default Orders;
