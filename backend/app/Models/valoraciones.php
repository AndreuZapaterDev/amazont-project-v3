<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class valoraciones extends Model
{
    //
    protected $table = 'valoraciones';
    protected $fillable = ['review','puntuacion','fecha','util','usuario_id','producto_id'];
    public $timestamps = false;

}
