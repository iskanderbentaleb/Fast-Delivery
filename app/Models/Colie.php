<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Colie extends Model
{
    protected $table = 'colies';

    protected $primaryKey = 'id';
    public $incrementing = false; // Since the ID is a custom string (not auto-increment)
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'tracking',
        'client_fullname',
        'client_phone',
        'client_address',
        'products',
        'external_id',
        'client_amount',
        'livreur_amount',
        'product_value',
        'return_fee',
        'has_exchange',
        'id_wilaya',
        'id_commune',
        'id_exchange_return',
        'id_status',
        'livreur_id',
        'id_payment',
    ];

    protected $casts = [
        'client_amount'     => 'decimal:2',
        'livreur_amount'    => 'decimal:2',
        'product_value'     => 'decimal:2',
        'return_fee'        => 'decimal:2',
        'has_exchange'      => 'boolean',
    ];

    // Relationships
    public function wilaya()
    {
        return $this->belongsTo(Wilaya::class, 'id_wilaya');
    }

    public function commune()
    {
        return $this->belongsTo(Communes::class, 'id_commune');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'id_status');
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'id_payment');
    }

    public function exchangeReturn()
    {
        return $this->belongsTo(Colie::class, 'id_exchange_return');
    }

    public function exchangedColies()
    {
        return $this->hasMany(Colie::class, 'id_exchange_return');
    }

    public function livreur()
    {
        return $this->belongsTo(Livreur::class, 'livreur_id');
    }

    public function histories()
    {
        return $this->hasMany(ColieHistory::class, 'id_colie');
    }
}
