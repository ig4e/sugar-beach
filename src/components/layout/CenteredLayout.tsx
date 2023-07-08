import { type ReactNode } from "react";

function CenteredLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-tr from-red-500  to-purple-500">
      {children}
    </div>
  );
}

export default CenteredLayout;
