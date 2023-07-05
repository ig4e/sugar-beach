import React, { ReactNode, createContext, useContext } from "react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export const SkeletonContext = createContext(false);

export function SkeletonWrap({ children }: { children: ReactNode }) {
  const isLoading = useContext(SkeletonContext);

  if (isLoading) return <Skeleton>{children}</Skeleton>;

  return children;
}
