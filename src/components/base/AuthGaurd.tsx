import { type User, type UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type ReactNode, useEffect } from "react";

const levels = ["NONE", "USER", "STAFF", "ADMIN"];

function AuthGaurd({
  children,
  allowedLevel = "USER",
}: {
  children: ReactNode;
  allowedLevel?: UserRole;
}) {
  // const router = useRouter();
  // const { data, status } = useSession({
  //   required: true,
  //   onUnauthenticated: () => {
  //     return void router.push(
  //       "/auth/signin?redirect=" + encodeURIComponent(router.asPath)
  //     );
  //   },
  // });

  // useEffect(() => {
  //   if (status === "loading") return;
  //   const userRole = (data?.user as User)?.role;
  //   const allowedLevelIndex = levels.indexOf(allowedLevel);
  //   const userLevelIndex = levels.indexOf(userRole);
  //   if (userLevelIndex < allowedLevelIndex) {
  //     void router.push("/auth/signin");
  //   }
  // }, [data, status, router, allowedLevel]);

  return children;
}

export default AuthGaurd;
