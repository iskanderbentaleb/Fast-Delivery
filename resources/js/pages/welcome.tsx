import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    // Redirect logged-in users to the dashboard
    useEffect(() => {
        if (auth.user) {
            window.location.href = route('dashboard');
        }
    }, [auth.user]);

    return (
        <>
            <Head title="Bienvenue">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                {!auth.user && (
                    <div className="flex w-full flex-col items-center justify-center gap-6 opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
                            <Link
                                href={route('admin.login')}
                                className="flex flex-col items-center justify-center rounded-lg border border-[#19140035] bg-white p-6 text-center shadow-sm transition-all hover:border-[#1915014a] hover:shadow-md dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:hover:border-[#62605b]"
                            >
                                <img src="/images/admin.png" alt="Admin" className="h-24 w-24 object-cover" />
                                <h2 className="mt-4 text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Admin</h2>
                                <p className="mt-2 text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                                    Accédez au tableau de bord admin pour gérer le système.
                                </p>
                            </Link>

                            <Link
                                href={route('livreur.login')}
                                className="flex flex-col items-center justify-center rounded-lg border border-[#19140035] bg-white p-6 text-center shadow-sm transition-all hover:border-[#1915014a] hover:shadow-md dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:hover:border-[#62605b]"
                            >
                                <img src="/images/livreur.png" alt="Livreur" className="h-24 w-24 object-cover" />
                                <h2 className="mt-4 text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Livreur</h2>
                                <p className="mt-2 text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                                    Accédez au tableau de bord livreur pour gérer les commandes.
                                </p>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
