<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class productos_carrito extends Model
{
    protected $table = 'productos_carrito';
    protected $fillable = ['producto_id', 'cantidad', 'precio'];
    public $timestamps = false;
}
