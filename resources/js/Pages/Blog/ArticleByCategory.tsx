import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BlogLayout from "@/Layouts/BlogLayout";
import { Article, Category } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ArticleByCategoryProps {
    articles: {
        // Array dari artikel yang diterima sebagai props
        data: Article[],
        current_page: number;
        last_page: number;
    },
    category: Category
}

export default function ArticleByCategory({ articles, category }: ArticleByCategoryProps) {

    const [dataArticles, setDataArticles] = useState<Article[]>(articles.data)
    const [currentPage, setCurrentPage] = useState(articles.current_page)
    const [loading, setLoading] = useState(true)

    /** useEffect untuk menonaktifkan loading */
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(timer) // Menghapus timer saat komponen tidak aktif
    }, [dataArticles])


    /**
     *
     * @param page
     * @returns
     *
     * Fungsi untuk memuat halaman
     */
    const loadPage = async (page: number) => {

        // Cegah pemuatan jika sedang loading atau halaman tidak valid
        if (loading || page < 1 || page > articles.last_page) return
        setLoading(true)

        // Panggil route untuk mendapatkan data artikel baru
        router.get(`/articles-category/${category.slug}`, { page }, {
            preserveScroll: true, // Pertahankan posisi scroll saat berpindah halaman
            preserveState: false,  // Reset state sebelumnya
            onSuccess: (page) => {

                // Perbarui state dengan data artikel yang diterima
                const newArticles = page.props.articles as {
                    data: Article[];
                    current_page: number;
                    last_page: number
                }
                setDataArticles(newArticles.data)
                setCurrentPage(newArticles.current_page)
            },
            // Nonaktifkan loading setelah selesai
            onFinish: () => setLoading(false)
        })
    }
    return (
        <BlogLayout>
            <Head title={`Article ` + category.title} />
            <div className='container mx-auto flex flex-col lg:flex-row gap-4'>
                <div className='w-full'>
                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        {/* Tampilkan skeleton loading saat loading aktif */}
                        {loading ? (
                            <>
                                {Array.from({ length: dataArticles.length }).map((_, index) => (
                                    <Card className='shadow-lg' key={index}>
                                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                            <Skeleton className='h-4 w-1/2' />
                                            <Skeleton className='h-4 w-1/4' />
                                        </CardHeader>
                                        <CardContent>
                                            <Skeleton className='h-40 w-full' />
                                            <Skeleton className='h-6 w-3/4 mt-4' />
                                        </CardContent>
                                    </Card>
                                ))}
                            </>
                        ) : dataArticles.length === 0 ? (
                            <div className="text-center">
                                <p>Tidak ada artikel yang tersedia.</p>
                            </div>
                        ) : (

                            // Tampilkan data artikel saat loading selesai
                            dataArticles.map((article, index) => (
                                <Card className='shadow-lg hover:bg-slate-400/10' key={index}>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium text-wrap'>
                                            {article.user?.name}
                                        </CardTitle>
                                        <span className='text-wrap'>{article.category.title}</span>
                                    </CardHeader>
                                    <CardContent>
                                        <img src={article.image} alt={article.slug}
                                            className='w-full h-auto object-cover rounded-md'
                                        />
                                        <div className='text-2xl font-bold my-4'>
                                            <Link href='#'>{article.title}</Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}

                    </div>

                    <div className='flex justify-center gap-3 items-center mt-8'>
                        {/* Tombol untuk memuat halaman sebelumnya */}
                        <Button
                            variant={"secondary"}
                            onClick={() => loadPage(currentPage - 1)}
                            disabled={currentPage <= 1} // Nonaktifkan jika di halaman pertama
                        >
                            Prev
                        </Button>

                        {/* Tombol untuk memuat halaman berikutnya */}
                        <Button
                            onClick={() => loadPage(currentPage + 1)}
                            disabled={currentPage >= articles.last_page} // Nonaktifkan jika di halaman terakhir
                        >
                            {loading ? <Loader2 className='animate-spin size-3' /> : "Next"}
                        </Button>
                    </div>
                </div>
            </div>
        </BlogLayout>
    )
}
