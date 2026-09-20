import { ReactNode } from "react";

function DashboardLaout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header>Dashboard Header</header>

      <main>{children}</main>
    </div>
  );
}

export default DashboardLaout;
