import { useEffect, useState } from "react";
import axios from "axios";

import { StatusDistributionChart } from "./components/dashboard_components/StatusDistributionChart";
import { TauxLivraison } from "./components/dashboard_components/TauxLivraison";

const Dashboard = ({ livreurId }) => {
  const [metrics, setMetrics] = useState([]);
  const [livraisonData, setLivraisonData] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);
  const [statusChartConfig, setStatusChartConfig] = useState({});
  const [livraisonChartConfig, setLivraisonChartConfig] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!livreurId) return;

    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`livreurs/${livreurId}/dashboard`);
        const data = res.data;

        // 💰 Metrics
        const formattedMetrics = [
          {
            label: "Montant dû par les clients (non payé)",
            value: `${data.total_client_payment_non_paid.toLocaleString()} DZD`,
            color: "#51826b",
          },
          {
            label: "Montant dû au livreur (non payé)",
            value: `${data.total_courier_net_payment_non_paid.toLocaleString()} DZD`,
            color: "#51826b",
          },
          {
            label: "Montant total du magasin (en attente)",
            value: `${data.total_store_payment_non_paid.toLocaleString()} DZD`,
            color: "#51826b",
          },
          {
            label: "Montant réglé par les clients",
            value: `${data.total_client_payment.toLocaleString()} DZD`,
            color: "#5085b3",
          },
          {
            label: "Profit total du livreur (payé)",
            value: `${data.total_courier_net_payment.toLocaleString()} DZD`,
            color: "#5085b3",
          },
          {
            label: "Montant total du magasin (payé)",
            value: `${data.total_store_payment.toLocaleString()} DZD`,
            color: "#5085b3",
          },
        ];

        // 📦 Livraison (delivered, returned...)
        const formattedLivraisonData = data.livraison_data.map((item) => ({
          browser: item.status.toLowerCase(), // used as key
          commandes: item.commandes,
          fill: item.fill,
          label: item.status,
          textColor: item.textColor,
        }));

        const generatedLivraisonChartConfig = Object.fromEntries(
          formattedLivraisonData.map((item) => [
            item.browser,
            { label: item.label, color: item.fill, textColor: item.textColor },
          ])
        );

        // 📊 Status distribution
        const formattedStatusData = data.status_chart_data.map((item) => ({
          browser: item.status,
          commandes: item.commandes,
          fill: item.fill,
        }));

        const formattedStatusConfig = data.status_chart_data.reduce((acc, item) => {
          acc[item.status] = {
            label: item.label,
            color: item.fill,
            textColor: item.color,
          };
          return acc;
        }, {});

        // Set state
        setMetrics(formattedMetrics);
        setLivraisonData(formattedLivraisonData);
        setLivraisonChartConfig(generatedLivraisonChartConfig);
        setStatusChartData(formattedStatusData);
        setStatusChartConfig(formattedStatusConfig);
      } catch (error) {
        console.error("Erreur lors du chargement du tableau de bord:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [livreurId]);

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="h-full overflow-y-auto space-y-8 scrollbar-hide mt-3 mb-4">
      <div className="grid grid-cols-1 gap-2">
        {metrics.length > 0 ? (
          metrics.map((metric, index) => (
            <div
              key={index}
              className="rounded-2xl border bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h4 className="text-sm text-gray-500 font-medium mb-1 dark:text-white">
                {metric.label}
              </h4>
              <p className="text-2xl font-bold" style={{ color: metric.color }}>
                {metric.value}
              </p>
            </div>
          ))
        ) : (
          <div>Aucune donnée disponible.</div>
        )}
      </div>

      <TauxLivraison
        title="Taux de livraison"
        data={livraisonData}
        highlightKey="livré" // should match lowercase status name
        chartConfig={livraisonChartConfig}
      />

      <StatusDistributionChart
        title="Répartition des statuts"
        description="Statistiques de Janvier à Juin 2024"
        data={statusChartData}
        config={statusChartConfig}
      />
    </div>
  );
};

export { Dashboard };
