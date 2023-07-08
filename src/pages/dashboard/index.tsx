import type { GetStaticProps } from "next";
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

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || "en";

  const messages = (await import(
    `public/locales/${locale}.json`
  )) as unknown as { default: Messages };

  return {
    props: {
      messages: messages.default,
    },
  };
};

export default DashboardHome;
