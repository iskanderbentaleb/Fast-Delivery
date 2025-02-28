<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Wilaya extends Model
{
    use HasFactory;

    public $incrementing = false; // Disables auto-incrementing ID
    protected $keyType = 'string'; // Ensures ID is treated as a string

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->id = Str::uuid(); // Automatically generates UUID
        });
    }

    public function communes()
    {
        return $this->hasMany(Communes::class, 'wilaya_id');
    }
}
