import { Button } from "@chakra-ui/react";
import Link from "next/link";
import CenteredLayout from "~/components/Layout/CenteredLayout";

function NotFound() {
  return (
    <CenteredLayout>
      <div className="flex flex-col gap-4 rounded-md p-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">Looks like you&apos;re lost</h1>
        </div>
        <Link href="/">
          <Button className="w-full">
            Go back home
          </Button>
        </Link>
      </div>
    </CenteredLayout>
  );
}

export default NotFound;
