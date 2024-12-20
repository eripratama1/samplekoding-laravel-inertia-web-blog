import { Article } from "@/types"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Link } from "@inertiajs/react"

interface SearchBarProps {
    dataArticles?: Article[]
}

export default function SearchBar({ dataArticles = [] }: SearchBarProps) {

    const [query, setQuery] = useState("")
    const [searchArticles, setSearchArticles] = useState<Article[]>(dataArticles)
    const [loading, setLoading] = useState(false)
    const [searchCompleted, setSearchCompleted] = useState(false)

    /**
     * Fetch articles data dari server
     * Ketika query berubah, maka akan melakukan fecth data
     * Jika query kosong, maka akan menampilkan dataArticles
     * Jika query tidak kosong, maka akan menampilkan data pencarian
     *
     */
    useEffect(() => {
        const fetchArticles = async () => {
            if (query) {
                setLoading(true)
                setSearchCompleted(false)
                try {
                    const response = await fetch(`/search-articles?query=${query}`);
                    const data = await response.json()
                    setSearchArticles(data)
                } catch (error) {
                    console.error("failed to fetch data articles", error);
                } finally {
                    setLoading(false)
                    setSearchCompleted(true)
                }
            } else {
                setSearchArticles(dataArticles)
                setSearchCompleted(false)
            }
        }

        /**
         * Debounce fetch data
         *
         */
        const debounceFetch = setTimeout(fetchArticles, 1000)
        return () => clearTimeout(debounceFetch)
    }, [query])


    return (
        <div className="relative w-full sm:w-[300px] md:w-[300px] lg:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search article...."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 sm:w-[300px] md:w-[300px] lg:w-[300px]"
            />

            {/**
             * Menampilkan pesan loading jika sedang melakukan pencarian
             */}
            {loading && query && (
                <p className="absolute w-full bg-white shadow-lg mt-1 rounded-lg px-4 py-2">
                    Search data...
                </p>
            )}

            {/**
             * Menampilkan pesan jika pencarian tidak ditemukan
             */}
            {!loading && searchCompleted && searchArticles.length === 0 && query && (
                <p className="absolute w-full bg-white shadow-lg mt-1 rounded-lg px-4 py-2">
                    Article Not found
                </p>
            )}

            <ul className="absolute w-full bg-white shadow-lg mt-1 rounded-lg">
                {/*
                  Menampilkan data pencarian artikel
                */}
                {searchArticles.map((article) => (
                    <li className="px-4 py-2 hover:bg-gray-100" key={article.id}>
                        <Link href={route('read', article.slug)}>
                            {article.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
