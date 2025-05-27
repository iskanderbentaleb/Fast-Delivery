<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class colieHistory extends Model
{
    protected $fillable = [
        'id_colie',
        'id_status',
        'id_reason',
        'id_livreur',
        'note',
    ];

        // Relationships
    public function colie()
    {
        return $this->belongsTo(Colie::class, 'id_colie');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'id_status');
    }

    public function reason()
    {
        return $this->belongsTo(Reason::class, 'id_reason');
    }

    public function livreur()
    {
        return $this->belongsTo(Livreur::class, 'id_livreur');
    }

    // Casts for dates
    protected $casts = [
        'created_at' => 'datetime',
    ];

}
