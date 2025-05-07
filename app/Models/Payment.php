<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Payment extends Model
{
    use HasUuids;

    protected $table = 'payments';

    protected $fillable = [
        'total_store_payment',
        'total_courier_payment',
        'total_return_fee_payment',
        'total_damaged_payment',
        'created_by_id',
        'livreur_id',
        'payment_date',
    ];

    protected $casts = [
        'payment_date' => 'date',
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
}
