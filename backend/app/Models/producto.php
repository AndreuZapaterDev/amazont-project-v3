<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class producto extends Model
{
    //

    protected $table = 'producto';
    protected $fillable = ['nombre','precio','descuento','descripcion','stock', 'inicio'];
    public $timestamps = false;

}

