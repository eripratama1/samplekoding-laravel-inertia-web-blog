import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { DollarSign } from 'lucide-react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';

// Menerima props 'auth' yang bertipe 'PageProps'
// Tipe PageProps mendefinisikan struktur data yang diterima oleh auth,
// yang berisi informasi tentang pengguna yang login.
export default function Dashboard({ auth }: PageProps) {

    const checkRole = auth.user.roles.length == 0;
    console.log("Result checkRole", checkRole);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            {checkRole && <Button>Become an article writer</Button>}

            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
