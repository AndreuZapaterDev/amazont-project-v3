<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class productoCategorias extends Model
{
    //
    protected $table = 'producto_categorias';
    protected $fillable = ['categoria_id','producto_id'];
    public $timestamps = false;

}
