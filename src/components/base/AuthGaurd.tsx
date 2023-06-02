import { User, UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function AuthGaurd({
  children,
  allowedLevel = "USER",
}: {
  children: any;
  allowedLevel?: UserRole;
}) {
  const levels = ["NONE", "USER", "STAFF", "ADMIN"];

  const router = useRouter();
  const { data, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      return router.push(
        "/auth/login?redirect=" + encodeURIComponent(router.asPath)
      );
    },
  });

  useEffect(() => {
    if (status === "loading") return;
    const userRole = (data?.user as User)?.role;
    const allowedLevelIndex = levels.indexOf(allowedLevel);
    const userLevelIndex = levels.indexOf(userRole);
    if (userLevelIndex < allowedLevelIndex) {
      router.push("/auth/login");
    }
  }, [data]);

  return children;
}

export default AuthGaurd;
