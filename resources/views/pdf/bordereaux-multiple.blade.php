<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bordereau de Livraison</title>
    <style>
        :root {
            --primary-color: #000000;
            --secondary-color: #db3434;
            --echange-color: #dbba34;
            --accent-color: #e74c3c;
            --light-gray: #f8f9fa;
            --medium-gray: #e9ecef;
            --dark-gray: #495057;
            --border-color: #c3c4c5;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            unicode-bidi: embed;
        }

        @font-face {
            font-family: 'DejaVu Sans';
            font-style: normal;
            font-weight: normal;
            src: url({{ storage_path('fonts/DejaVuSans.ttf') }}) format('truetype');
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            color: var(--dark-gray);
            background-color: white;
            padding: 15px;
        }

        .shipping-label {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            border: 1px solid var(--primary-color);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        /* Header Styles */
        .label-header {
            padding: 15px 25px;
            text-align: center;
            border-bottom: 4px solid var(--secondary-color);
        }

        .label-title.combined {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: var(--primary-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }

        .label-title.combined span.separator {
            color: var(--border-color);
        }

        .label-title.combined span[style*="color: var(--secondary-color)"] {
            color: var(--secondary-color) !important;
        }

        /* Address Styles */
        .address-container {
            display: flex;
            padding: 10px 15px;
            background-color: var(--light-gray);
            gap: 15px;
        }

        .address-box {
            flex: 1;
            padding: 15px;
            background-color: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            border: 1px solid var(--border-color);
        }

        .address-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid var(--medium-gray);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .address-content {
            font-size: 20px;
        }

        .address-content strong {
            font-weight: 500;
            color: var(--primary-color);
            display: block;
            margin-bottom: 5px;
        }


        .address-title-echange-send {
            background: var(--secondary-color);
            display: inline;
            float:right;
            padding:5px;
        }

        .address-title-echange-return{
            background: var(--echange-color);
            display: inline;
            float:right;
            padding:5px;
        }


        /* Barcode Styles */
        .barcode-section {
            border-top: 2px dashed var(--border-color);
            border-bottom: 2px dashed var(--border-color);
            text-align: center;
            padding: 5px 0;
            background-color: white;
        }

        .barcode-container {
            margin: 0 auto;
            padding: 10px;
            display: inline-block;
            border: 1px solid var(--border-color);
            border-radius: 4px;
        }

        .tracking-number {
            font-size: 45px;
            font-weight: 700;
            letter-spacing: 2px;
            color: var(--primary-color);
            font-family: 'Courier New', monospace;
        }

        .shipment-date {
            color: var(--dark-gray);
            font-weight: 500;
            float: left;
            font-size: 12px;
        }

        /* Table Styles */
        .products-table {
            width: 100%;
            border-collapse: collapse;
            padding: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .products-table th {
            color: var(--primary-color);
            border: 2px solid var(--primary-color);
            font-weight: 500;
            padding: 0 15px;
            text-align: left;
            text-transform: uppercase;
            font-size: 18px;
            letter-spacing: 0.5px;
        }

        .products-table td {
            height: 100px;
            padding: 15px;
            font-size: 20px;
            border: 2px solid var(--primary-color);
            vertical-align: top;
        }

        .products-table tr:nth-child(even) {
            background-color: var(--light-gray);
        }

        .amount-cell {
            text-align: right;
            font-weight: 500;
            font-family: 'Courier New', monospace;
        }

        /* Footer Styles */
        .signature-declaration-container {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding: 0 25px 20px;
            margin-top: 20px;
        }

        .declaration-box {
            flex: 1;
            width: 50%;
            padding: 15px;
            background-color: var(--light-gray);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-size: 15px;
            line-height: 1.6;
        }

        .signature-container {
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            min-width: 200px;
        }

        .cachet-box {
            text-align: right;
            font-size: 15px;
            margin-right: 30px;
            line-height: 1.6;
        }

        .declaration-title {
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 8px;
            text-transform: uppercase;
        }

        @media print {
            body {
                padding: 0;
                background: none;
            }
            .shipping-label {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    @foreach($colies as $colie)

    <div class="shipping-label">
        <div class="label-header">
            <div class="label-title combined">
                Bordereau de Livraison <span class="separator">|</span> <span style="color: var(--secondary-color);">FAST DELIVERY</span>
            </div>
        </div>

        <div class="address-container">
            <div class="address-box">
                <div class="address-title">
                    Expéditeur
                    @if ($colie->has_exchange)
                        <div class="address-title-echange-send">AVEC ÉCHANGE</div>
                    @endif
                    @if ($colie->id_exchange_return)
                        <div class="address-title-echange-return">ÉCHANGE COLLECTÉ</div>
                    @endif
                </div>
                <div class="address-content">
                    <strong>{{Auth::user()->storename ?? 'Non spécifié' }}{{ $colie->external_id ? ' , N° CMD (' . $colie->external_id . ')' : '' }}</strong>
                    <strong>{{ Auth::user()->phone ?? 'Non spécifié' }}</strong>
                </div>
            </div>

            <div class="address-box">
                <div class="address-title">Destinataire</div>
                <div class="address-content">
                    <strong style="display: inline">{{ $colie->client_fullname ?? '/' }}</strong>
                    <strong style="display: inline">( {{ $colie->client_phone ?? 'Non spécifié' }} )</strong>
                    <div>
                        {{ $colie->wilaya->wilaya_name ?? 'Error' }},
                        {{ $colie->commune->commune_name ?? 'Wilaya inconnue' }},
                        {{ $colie->client_address ?? '' }}
                    </div>
                </div>
            </div>
        </div>

        <div class="barcode-section">
            <div class="barcode-container">
                {!! DNS1D::getBarcodeHTML($colie->tracking ?? '000000', 'C128', 4, 100) !!}
            </div>
            <div class="tracking-number">{{ $colie->tracking ?? 'NON-ATTRIBUE' }}</div>
        </div>

        <table class="products-table">
            <thead>
                <tr>
                    <th style="width: 65%;">Description du contenu</th>
                    <th style="width: 35%;">Recouvrement (DA)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $colie->products ?? 'Non spécifié' }}</td>
                    <td class="amount-cell">{{ number_format($colie->client_amount ?? 0, 2, ',', ' ') }}</td>
                </tr>
            </tbody>
        </table>

        <div class="signature-declaration-container">
            <div class="declaration-box">
                <div class="declaration-title">Déclaration de l'expéditeur</div>
                Je soussigné(e), {{ Auth::user()->name ?? 'l\'expéditeur' }}, certifie que les détails déclarés sur ce bordereau sont corrects et que le colis ne contient aucun produit dangereux ou interdit par la loi. Je déclare avoir lu et approuvé les conditions générales de transport.
            </div>

            <div class="signature-container">
                <div class="cachet-box">
                    Cachet et signature de l'expéditeur
                    <div class="shipment-date">Le : {{ now()->format('d/m/Y H:i') }}</div>
                </div>
            </div>
        </div>
    </div>
    @endforeach
</body>
</html>
