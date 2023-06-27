import React from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import UserDashboardLayout from "~/components/layout/UserDashboardLayout";

function MyAccount() {
  return (
    <AuthGaurd>
      <UserDashboardLayout>
        <div className="grid grid-cols-2"></div>
      </UserDashboardLayout>
    </AuthGaurd>
  );
}

export default MyAccount;
