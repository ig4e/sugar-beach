import React from "react";

function CenteredLayout({ children }: { children: any }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-pink-400 via-orange-400 to-cyan-400">
      {children}
    </div>
  );
}

export default CenteredLayout;
