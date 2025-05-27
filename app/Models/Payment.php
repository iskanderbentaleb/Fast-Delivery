<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Payment extends Model
{
    use HasUuids;

    protected $table = 'payments';

    protected $fillable = [
        'total_client_payment',
        'total_return_fee_payment',
        'total_courier_delivered_payment',
        'total_courier_net_payment',
        'total_store_payment',
        'created_by_id',
        'livreur_id',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function livreur()
    {
        return $this->belongsTo(Livreur::class);
    }

    public function colies()
    {
        return $this->hasMany(Colie::class, 'id_payment');
    }
}
