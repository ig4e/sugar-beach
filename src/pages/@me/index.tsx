import React from "react";
import AuthGaurd from "~/components/base/AuthGaurd";
import MainLayout from "~/components/layout/MainLayout";

function MyAccount() {
  return (
    <AuthGaurd>
      <MainLayout>
        <div>This is protected!!!</div>
      </MainLayout>
    </AuthGaurd>
  );
}

export default MyAccount;
