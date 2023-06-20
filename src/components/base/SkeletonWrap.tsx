import React, { createContext, useContext } from "react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export const SkeletonContext = createContext(false);

export function SkeletonWrap({ children }: { children: any }) {
  const isLoading = useContext(SkeletonContext);

  if (isLoading) return <Skeleton>{children}</Skeleton>;

  return children;
}
