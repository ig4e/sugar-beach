import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import CenteredLayout from "~/components/layout/CenteredLayout";
import MainLayout from "~/components/layout/MainLayout";

function NotFound() {
  return (
    <CenteredLayout>
      <div className="flex flex-col gap-4 rounded-md p-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">Looks like you're lost</h1>
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
