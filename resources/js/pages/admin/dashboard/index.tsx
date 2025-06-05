import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ChartLine } from './components/ChartLine';
import { TauxLivraison } from './components/TauxLivraison';
import { useEffect, useState } from 'react';
import { StatusDistributionChart } from './components/StatusDistributionChart';

    const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: '/dashboard',
    },
    ];

    function formatNumber(value: number | string) {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    // Force exactly two decimal digits, always
    const formatted = num.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const [intPart, decimalPart] = formatted.split(',');
    return { intPart, decimalPart };
    }




export default function DashboardPage() {

  const [livraisonChartConfig, setLivraisonChartConfig] = useState({});
  const [livraisonData, setLivraisonData] = useState([]);

  const [statusChartData, setStatusChartData] = useState([]);
  const [statusChartConfig, setStatusChartConfig] = useState({});

  const {
    total_client_payment_non_paid,
    total_courier_net_payment_non_paid,
    total_store_payment_non_paid,
    total_client_payment,
    total_courier_net_payment,
    total_store_payment,
    taux_livraison,
    repartition_des_statuts,
    chartData,
    availableYears,
    currentYear,
    yearlyTotals
    } = usePage().props;

  const stats = [
    { title: 'Montant dû par les clients (non payé)', value: total_client_payment_non_paid },
    { title: 'Montant dû aux livreurs (non payé)', value: total_courier_net_payment_non_paid},
    { title: 'Montant total du magasin (en attente)', value: total_store_payment_non_paid },
    { title: 'Montant réglé par les clients', value: total_client_payment },
    { title: 'Profit total des livreurs (payé)', value: total_courier_net_payment },
    { title: 'Montant total du magasin (payé)', value: total_store_payment },
  ];




    useEffect(() => {

        // 📦 Livraison (delivered, returned...)
        const formattedLivraisonData = taux_livraison.map((item) => ({
          browser: item.status.toLowerCase(), // used as key
          commandes: item.commandes,
          fill: item.fill,
          label: item.status,
          textColor: item.textColor,
        }));



        const generatedLivraisonChartConfig = Object.fromEntries(
            formattedLivraisonData.map((item) => [
                item.browser,
                { label: item.label + " = " , color: item.fill, textColor: item.textColor },
            ])
        );


        // 📊 Status distribution
        const formattedStatusData = repartition_des_statuts.map((item) => ({
          browser: item.status + " =  ",
          commandes: item.commandes,
          fill: item.fill,
        }));

        const formattedStatusConfig = repartition_des_statuts.reduce((acc, item) => {
          acc[item.status] = {
            label: item.label,
            color: item.fill,
            textColor: item.color,
          };
          return acc;
        }, {});


        setLivraisonData(formattedLivraisonData);
        setLivraisonChartConfig(generatedLivraisonChartConfig);
        setStatusChartData(formattedStatusData);
        setStatusChartConfig(formattedStatusConfig);
    }, []);


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tableau de bord" />
        <div className="flex flex-col gap-6 p-4">

            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">Statistiques des paiements</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {stats.map((stat, i) => {
                    const { intPart, decimalPart } = formatNumber(stat.value);
                    return (
                        <div
                        key={i}
                        className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-muted bg-white p-4 shadow-sm transition-transform hover:scale-[1.02] duration-200 dark:border-neutral-700 dark:bg-neutral-900"
                        >
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10 pointer-events-none" />
                        <div className="relative z-10 flex flex-col space-y-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</span>

                            <div className="relative flex items-start">
                            {/* Currency label (DZD) */}
                            <span className="absolute right-0 -top-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                DZD
                            </span>

                            {/* Formatted number */}
                            <div className="flex items-end space-x-1">
                                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {intPart}
                                </span>
                                <span className="pb-1 text-lg font-semibold text-gray-500 dark:text-gray-400">
                                ,{decimalPart}
                                </span>
                            </div>
                            </div>
                        </div>
                        </div>
                    );
                    })}
                </div>
            </section>

            <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">Statistiques des Colis</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
                <div className="relative overflow-hidden rounded-xl border border-muted shadow-sm transition-transform hover:scale-[1.02] duration-200 dark:border-neutral-700">
                    <div className="relative z-10 w-full h-full">
                        <TauxLivraison
                            title="Taux de livraison"
                            Description=""
                            highlightKey="livré"
                            data={livraisonData}
                            chartConfig={livraisonChartConfig}
                        />
                    </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-muted shadow-sm transition-transform hover:scale-[1.02] duration-200 dark:border-neutral-700">
                    <div className="relative z-10 w-full h-full">
                        <StatusDistributionChart
                            title="Répartition des statuts"
                            description=""
                            data={statusChartData}
                            config={statusChartConfig}
                        />
                    </div>
                </div>
            </div>
            </section>

            {/* <section className="bg-white shadow-sm transition-transform hover:scale-[1.01] duration-200 dark:border-neutral-700 dark:bg-neutral-900">
                <ChartLine
                livrebackgroundHex={livraisonData[0]?.fill}
                retournebackgroundHex={livraisonData[1]?.fill}
                />
            </section> */}

                <section className="bg-white shadow-sm transition-transform hover:scale-[1.01] duration-200 dark:border-neutral-700 dark:bg-neutral-900">
                    <ChartLine
                        livrebackgroundHex={livraisonData[0]?.fill}
                        retournebackgroundHex={livraisonData[1]?.fill}
                        chartData={chartData}
                        yearlyTotals={yearlyTotals}
                        availableYears={availableYears}
                        currentYear={currentYear}
                    />
                </section>

        </div>
    </AppLayout>
  );
}
