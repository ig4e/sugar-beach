import { GetStaticProps } from "next";
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
  return {
    props: {
      messages: (await import(`public/locales/${context.locale}.json`)).default,
    },
  };
};

export default DashboardHome;
