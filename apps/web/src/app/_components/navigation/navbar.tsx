import { SearchBar } from "../search/search-bar";
import { AuthSection } from "./auth-section";
import { MobileMenu } from "./mobile-menu";
import { NavLogo } from "./nav-logo";

export function Navbar() {
    return <nav className="border-b h-20 border-stroke fixed w-full z-10 bg-white dark:bg-black font-clash">
        <div className="flex items-center px-6 sm:px-12 h-full justify-between gap-2">
            <NavLogo />
            <SearchBar />
            <AuthSection />
            <MobileMenu />
        </div>
    </nav>
}