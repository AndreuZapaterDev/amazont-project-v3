<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class carrito extends Model
{
    protected $table = 'carrito';
    protected $fillable = ['user_id', 'total', 'fecha_pago', 'acabado'];
    public $timestamps = false;
}
