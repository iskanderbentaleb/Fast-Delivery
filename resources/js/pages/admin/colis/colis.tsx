import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Colis',
        href: '/colis',
    },
];

export default function Colis() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Colis" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    Colis
                </div>
        </AppLayout>
    );
}
