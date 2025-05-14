<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class metodos_pago extends Model
{
    //
    protected $table = 'metodos_pago';
    protected $fillable = ['user_id', 'nombre', 'tarjeta', 'caducidad', 'cvv', 'eliminado'];
    public $timestamps = false;
}
