import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
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
            Colis
        </AppLayout>
    );
}
