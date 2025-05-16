<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateColieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fullName' => 'required|string|max:50',
            'phone' => 'required|string|max:50',
            'adress' => 'required|string|max:100',
            'product' => 'required|string|max:100',
            'numero_commande' => 'nullable|string|max:30',
            'prix_avec_livraison' => 'required|numeric|min:0',
            'delivery_price' => 'required|numeric|min:0',
            'product_value' => 'required|numeric|min:0',
            'return_price' => 'required|numeric|min:0',
            'exchangeProduct' => 'nullable|string|max:100',
            'valueExchangeProduct' => 'nullable|numeric|min:0',

            'wilaya' => 'required|integer|exists:wilayas,id',
            'commune' => 'required|integer|exists:communes,id',
            'livreur_id' => 'required|integer|exists:livreurs,id',
            'id_payment' => 'nullable|uuid|exists:payments,id',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'Le champ :attribute est obligatoire.',
            'string' => 'Le champ :attribute doit être une chaîne de caractères.',
            'max' => 'Le champ :attribute ne doit pas dépasser :max caractères.',
            'numeric' => 'Le champ :attribute doit être un nombre.',
            'min' => 'Le champ :attribute doit être au moins :min.',
            'exists' => 'Le :attribute sélectionné est invalide.',
            'uuid' => 'L\'identifiant de paiement doit être un UUID valide.',
        ];
    }

    public function attributes(): array
    {
        return [
            'fullName' => 'nom complet du client',
            'phone' => 'téléphone du client',
            'adress' => 'adresse du client',
            'product' => 'produits',
            'numero_commande' => 'numéro de commande externe',
            'prix_avec_livraison' => 'montant client',
            'delivery_price' => 'montant livreur',
            'product_value' => 'valeur du produit',
            'return_price' => 'frais de retour',
            'exchangeProduct' => 'produit d\'échange',
            'valueExchangeProduct' => 'valeur d\'échange',
            'wilaya' => 'wilaya',
            'commune' => 'commune',
            'livreur_id' => 'livreur',
            'id_payment' => 'paiement',
        ];
    }
}
