import { Heading, Text, VStack } from "@chakra-ui/react";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";
import StaffTable from "~/components/staff/StaffTable";

function StaffPage() {
  return (
    <AuthGaurd allowedLevel="ADMIN">
      <AdminLayout>
        <div className="space-y-4">
          <VStack alignItems={"start"}>
            <Heading size={"md"}>Staff</Heading>
            <Text>
              Take control of access to Sugar Beach&apos;s administrative
              dashboard (Restricted to users with an ADMIN role only)
            </Text>
          </VStack>

          <StaffTable></StaffTable>
        </div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default StaffPage;
