import { PopularProfiles } from "@/components/discover/popular-profiles";
import { SearchList } from "@/components/search/search-list";

export default async function SearchPage() {

    return <div className="flex flex-col items-center p-4 w-screen">
        <SearchList />
        <div className="w-full md:hidden">
            <PopularProfiles />
        </div>
    </div>
}