import React from "react";

function CenteredLayout({ children }: { children: any }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-tr from-red-500  to-purple-500">
      {children}
    </div>
  );
}

export default CenteredLayout;
