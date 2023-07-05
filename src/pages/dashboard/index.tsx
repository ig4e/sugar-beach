import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/layout/AdminLayout";

function DashboardHome() {
  return (
    <AuthGaurd allowedLevel="STAFF">
      <AdminLayout>
        <div>DashboardHome</div>
      </AdminLayout>
    </AuthGaurd>
  );
}

export default DashboardHome;
