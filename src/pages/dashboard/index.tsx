import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";

function DashboardHome() {
  return (
    <AuthGaurd allowedLevel="STAFF">
      <AdminLayout>
        <div>
          <Alert>
            <AlertIcon />
            <AlertTitle>الصفحة تحت الانشاء</AlertTitle>
          </Alert>
        </div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default DashboardHome;
