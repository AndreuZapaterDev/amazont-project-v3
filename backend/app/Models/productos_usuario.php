<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class productos_usuario extends Model
{
    protected $table = 'productos_usuario';
    protected $fillable = ['producto_id', 'usuario_id'];
    public $timestamps = false;


}
