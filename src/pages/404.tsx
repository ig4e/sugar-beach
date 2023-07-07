import { Button } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Link from "next/link";
import CenteredLayout from "~/components/layout/CenteredLayout";

function NotFound() {
  return (
    <CenteredLayout>
      <div className="flex flex-col gap-4 rounded-md p-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">
            Looks like you&apos;re lost
          </h1>
        </div>
        <Link href="/">
          <Button className="w-full">Go back home</Button>
        </Link>
      </div>
    </CenteredLayout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      messages: (await import(`public/locales/${context.locale}.json`)).default,
    },
  };
};

export default NotFound;
