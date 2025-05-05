<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Communes extends Model
{
    public $incrementing = false; // Disable auto-increment
    protected $keyType = 'string'; // UUID as string

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    public function wilaya()
    {
        return $this->belongsTo(Wilaya::class, 'wilaya_id');
    }

    public function prices()
    {
        return $this->hasMany(CommunePrice::class, 'commune_id');
    }

}
