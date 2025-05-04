<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommunePrice extends Model
{
    // Disable auto-incrementing since the primary key is composite
    public $incrementing = false;

    // If you're not using timestamps on this table
    public $timestamps = false;

    // Define the primary key fields (for completeness)
    protected $primaryKey = ['livreur_id', 'commune_id'];

    // Mass assignable fields
    protected $fillable = [
        'livreur_id',
        'commune_id',
        'delivery_price',
        'return_price',
    ];

    /**
     * Get the livreur associated with this price.
     */
    public function livreur(): BelongsTo
    {
        return $this->belongsTo(Livreur::class);
    }

    /**
     * Get the commune associated with this price.
     */
    public function commune(): BelongsTo
    {
        return $this->belongsTo(Communes::class);
    }
}
