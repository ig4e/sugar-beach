import {
  Button,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";
import AddStaff from "~/components/staff/AddStaff";
import StaffTable from "~/components/staff/StaffTable";
import { api } from "~/utils/api";
import { useMemo } from "react";
import { useSession } from "next-auth/react";

function StaffPage() {
  const { data: sessionData } = useSession({ required: true });
  const user = sessionData?.user;

  const { data: dataPages, refetch } = api.user.getStaff.useInfiniteQuery({
    excludeIDs: user ? [user.id] : undefined,
  });

  const data = useMemo(() => {
    if (dataPages) {
      return dataPages.pages.flatMap((page) => page.items);
    }
    return [];
  }, [dataPages]);

  return (
    <AuthGaurd allowedLevel="ADMIN">
      <AdminLayout>
        <div className="space-y-4">
          <VStack alignItems={"start"}>
            <HStack justifyContent={"space-between"} w="full">
              <Heading size={"md"}>Staff</Heading>
              <AddStaff
                trigger={<Button>Add staff</Button>}
                onRefetch={() => void refetch()}
              ></AddStaff>
            </HStack>
            <Text>
              Take control of access to Sugar Beach&apos;s administrative
              dashboard (Restricted to users with an ADMIN role only)
            </Text>
          </VStack>

          <StaffTable data={data} refetch={() => void refetch()}></StaffTable>
        </div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default StaffPage;
