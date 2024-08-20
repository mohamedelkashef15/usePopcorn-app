import { ReactNode } from "react";

function Navbar({ children }: { children: ReactNode }) {
  return <nav className="nav-bar">{children}</nav>;
}

export default Navbar;
