<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport de Paiement #{{ $payment->id }}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 0.8cm;
    }

    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      font-size: 12px;
      color: #000;
      margin: 0;
      padding: 0;
      line-height: 1.4;
      background: #fff;
    }

    .container {
      padding: 10px;
    }

    .company-info {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
    }

    .company-info h2 {
      font-size: 18px;
      margin: 0;
    }

    .company-info p {
      font-size: 13px;
      margin: 4px 0;
      color: #333;
    }

    .document-title {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      margin: 20px 0;
    }

    .section-header {
      font-weight: bold;
      font-size: 14px;
      margin: 20px 0 10px;
      padding: 6px 10px;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 3px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 6px 8px;
      text-align: left;
    }

    th {
      background-color: #f9f9f9;
    }

    tr:nth-child(even) {
      background-color: #f5f5f5;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      border: 1px solid #ccc;
      padding: 8px 10px;
      background-color: #fff;
    }

    .summary-label {
      color: #333;
    }

    .summary-value {
      font-weight: bold;
    }

    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;

    }

    .signature-block {
      width: 50%;
      text-align: center;
      float: left;
    }

    .signature-line {
      margin: 40px auto 5px;
      border-top: 1px solid #000;
      width: 70%;
      position: relative;
    }

    .signature-label {
      font-size: 12px;
      margin-top: 5px;
    }

    .signature-date {
      position: absolute;
      top: -20px;
      right: 0;
      font-size: 10px;
      color: #444;
    }

    .footer {
      margin-top: 140px;
      text-align: center;
      font-size: 11px;
      color: #555;
      border-top: 1px solid #ccc;
      padding-top: 10px;
    }

    .page-break {
      page-break-before: always;
    }

    @media print {
      .section-header {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="company-info">
      <h2>{{ $admin->storename }}</h2>
      <p>
        {{ $admin->wilaya->wilaya_name ?? '' }}, {{ $admin->commune->commune_name ?? '' }}, {{ $admin->address ?? '' }} |
        Tél: {{ $admin->phone ?? '' }} |
        Email: {{ $admin->email ?? '' }}
      </p>
    </div>

    <div class="document-title">Rapport de Paiement</div>

    <div class="section-header">Informations Générales</div>
    <table>
      <tr>
        <th>Référence</th>
        <td>{{ $payment->id }}</td>
        <th>Date</th>
        <td>{{ $payment->created_at?->format('d/m/Y H:i') }}</td>
      </tr>
      <tr>
        <th>Créé par</th>
        <td>{{ $payment->creator->name ?? 'N/A' }}</td>
        <th>Livreur</th>
        <td>{{ $payment->livreur->name ?? 'N/A' }}</td>
      </tr>
    </table>

    <div class="section-header">Résumé Financier</div>
    <table class="w-full text-sm border border-gray-300 rounded overflow-hidden">
        <tbody>
            <tr class="border-b">
                <td class="p-2 font-medium">Total Client</td>
                <td class="p-2 text-right">{{ number_format($payment->total_client_payment, 2, ',', ' ') }} DZD</td>
            </tr>
            <tr class="border-b">
                <td class="p-2 font-medium">Frais de Retour</td>
                <td class="p-2 text-right">{{ number_format($payment->total_return_fee_payment, 2, ',', ' ') }} DZD</td>
            </tr>
            <tr class="border-b">
                <td class="p-2 font-medium">Dû au Livreur</td>
                <td class="p-2 text-right">{{ number_format($payment->total_courier_delivered_payment, 2, ',', ' ') }} DZD</td>
            </tr>
            <tr class="border-b">
                <td class="p-2 font-medium">Net au Livreur</td>
                <td class="p-2 text-right">{{ number_format($payment->total_courier_net_payment, 2, ',', ' ') }} DZD</td>
            </tr>
            <tr>
                <td class="p-2 font-medium">Montant Boutique</td>
                <td class="p-2 text-right">{{ number_format($payment->total_store_payment, 2, ',', ' ') }} DZD</td>
            </tr>
        </tbody>
    </table>


    <div class="signature-section">
      <div class="signature-block">
        <div class="signature-line">
          <div class="signature-date">Date: ____/____/____</div>
        </div>
        <div class="signature-label">Signature du Livreur</div>
      </div>
      <div class="signature-block">
        <div class="signature-line">
          <div class="signature-date">Date: ____/____/____</div>
        </div>
        <div class="signature-label">Signature de la Boutique</div>
      </div>
    </div>

    <div class="footer">
      Généré le {{ now()->format('d/m/Y H:i') }} par {{ $payment->creator->name ?? 'Système' }} |
      &copy; {{ date('Y') }} {{ $admin->storename }}
    </div>

    <div class="page-break"></div>

    <div class="section-header">Colis Inclus ({{ $payment->colies->count() }})</div>
    <table>
      <thead>
        <tr>
          <th>Tracking</th>
          <th>Statut</th>
          <th>Montant Client</th>
          <th>Montant Livreur</th>
          <th>Frais Retour</th>
          <th>Boutique</th>
          <th>Nom Client</th>
          <th>Téléphone</th>
          <th>Wilaya</th>
          <th>Commune</th>
          <th>Créé le</th>
        </tr>
      </thead>
      <tbody>
        @foreach ($payment->colies as $colie)
          @php
            $storeAmount = $colie->client_amount - ($colie->livreur_amount + $colie->return_fee);
          @endphp
          <tr>
            <td>{{ $colie->tracking }}</td>
            <td>{{ $colie->status->status ?? 'N/A' }}</td>
            <td>{{ number_format($colie->client_amount, 2, ',', ' ') }}</td>
            <td>{{ number_format($colie->livreur_amount, 2, ',', ' ') }}</td>
            <td>{{ number_format($colie->return_fee, 2, ',', ' ') }}</td>
            <td>{{ number_format(max($storeAmount, 0), 2, ',', ' ') }}</td>
            <td>{{ $colie->client_fullname }}</td>
            <td>{{ $colie->client_phone }}</td>
            <td>{{ $colie->wilaya->wilaya_name ?? 'N/A' }}</td>
            <td>{{ $colie->commune->commune_name ?? 'N/A' }}</td>
            <td>{{ $colie->created_at?->format('d/m/Y H:i') }}</td>
          </tr>
        @endforeach
      </tbody>
    </table>


  </div>
</body>
</html>
