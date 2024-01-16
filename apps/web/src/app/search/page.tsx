import { SearchList } from "../_components/search/search-list";

export default async function SearchPage({ searchParams }: { searchParams: { username: string } }) {
    return <div className="flex flex-col items-center p-4 w-screen">
        <SearchList searchParams={searchParams} />
    </div>
}