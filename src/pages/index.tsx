import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "~/components/layout/MainLayout";
import { api } from "~/utils/api";

const index: NextPage = () => {
  return (
    <MainLayout>
      <div>Hello</div>
    </MainLayout>
  );
};

export default index;
