<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class carrito extends Model
{
    protected $table = 'carrito';
    protected $fillable = ['user_id', 'total'];
    public $timestamps = false;
}
