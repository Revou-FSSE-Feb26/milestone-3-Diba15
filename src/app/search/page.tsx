import ActionButton from "@/components/home/ActionButton";
import SearchResults from "@/components/search/SearchResults";
import { Suspense } from "react";

export default function SearchPage() {
    return (
        <div className="p-4">
            <Suspense>
                <SearchResults />
            </Suspense>

            <ActionButton />
        </div>
    );
}