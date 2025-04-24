<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class metodos_pago extends Model
{
    //
    protected $table = 'metodos_pago';
    protected $fillable = ['user_id', 'nombre', 'tarjeta', 'caducidad', 'cvv', 'genero', 'imagen_usuario'];
    public $timestamps = false;
}
