import { AuthSection } from "./auth-section";
import { NavLogo } from "./nav-logo";

export function Navbar() {
  return (
    <nav className="z-10 w-full px-12 pb-3 h-12 md:h-20 border-stroke font-clash">
      <div className="flex items-center justify-between h-full gap-2 px-4 md:px-8">
        <NavLogo />
        <AuthSection />
      </div>
    </nav>
  );
}
