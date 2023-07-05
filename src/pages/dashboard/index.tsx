import AuthGaurd from "~/components/base/AuthGaurd";
import AdminLayout from "~/components/Layout/AdminLayout";

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
