import React from "react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

function SkeletonInput({
  children,
  isLoading,
}: {
  children: any;
  isLoading: boolean;
}) {
  if (isLoading) return <Skeleton>{children}</Skeleton>;

  return children;
}

export default SkeletonInput;
