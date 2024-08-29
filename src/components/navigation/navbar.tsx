import { SearchBar } from "../search/search-bar/with-popover";
import { AuthSection } from "./auth-section";
import { NavLogo } from "./nav-logo";

export function Navbar() {
  return (
    <nav className="fixed z-10 w-full h-12 bg-white border-b md:h-20 border-stroke dark:bg-black font-clash">
      <div className="flex items-center justify-between h-full gap-2 px-4 md:px-8">
        <NavLogo />
        <SearchBar />
        <AuthSection />
      </div>
    </nav>
  );
}
