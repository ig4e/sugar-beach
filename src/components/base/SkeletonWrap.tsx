import { Skeleton } from "@chakra-ui/react";
import { ReactNode, createContext, useContext } from "react";

export const SkeletonContext = createContext(false);

export function SkeletonWrap({ children }: { children: ReactNode }) {
  const isLoading = useContext(SkeletonContext);

  if (isLoading) return <Skeleton>{children}</Skeleton>;

  return children;
}
